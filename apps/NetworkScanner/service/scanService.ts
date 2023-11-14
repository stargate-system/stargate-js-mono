import {Dispatch, SetStateAction} from "react";
import scanConfig from "@/service/scanConfig";
import {ServerlessDeviceConnector} from "@/service/connectors/ServerlessDeviceConnector";
import {ConnectionState, CoreConfig} from "gate-core";
import {Router} from "gate-router";

const PROGRESS_MAX_COUNT = 300;
export enum scanResult {
    SUCCESS,
    FAILED_NETWORKS,
    FAILED_DEVICES,
    FAILED_TIMEOUT,
    ABORTED
}

let scanRunning = false;
let scanTimeout: NodeJS.Timeout | undefined;
let networkDetectedCallback: Function;
let deviceDetectedCallback: Function;
let scanFinishedCallback: Function;
let scanMessageSetter: Dispatch<SetStateAction<string>>;
let progressValueSetter: Dispatch<SetStateAction<number>>;
let progressValue = 0;
let progressInterval: NodeJS.Timeout | undefined;
let aliveSockets: WebSocket[] = [];
let openSockets: WebSocket[] = [];
let connectedDevices: ServerlessDeviceConnector[] = [];
let foundNetworks: string[] = [];
let releaseCreateSocketLatch: Function | undefined;
let releaseDeviceScanLatch: Function | undefined;

const startScan = (byte1: string,
                   byte2: string,
                   byte3: string,
                   onNetworkDetected: Function,
                   onDeviceDetected: Function,
                   onScanFinished: Function,
                   setScanMessage: Dispatch<SetStateAction<string>>,
                   setProgressValue: Dispatch<SetStateAction<number>>) => {
    networkDetectedCallback = onNetworkDetected;
    deviceDetectedCallback = onDeviceDetected;
    scanFinishedCallback = onScanFinished;
    scanMessageSetter = setScanMessage;
    progressValueSetter = setProgressValue;
    scanRunning = true;
    if (byte3.length) {
        const ipPattern = byte1 + '.' + byte2 + '.' + byte3 + '.x';
        scanForDevices(ipPattern, true);
    } else {
        scanForNetworks(byte1 + '.' + byte2 + '.x.' + scanConfig.networkProbeLsb);
    }
    startProgress();
    setScanTimeout();
}

const setScanTimeout = () => {
    if (scanTimeout) {
        clearTimeout(scanTimeout);
    }
    scanTimeout = setTimeout(() => {
        scanTimeout = undefined;
        finishScan(scanResult.FAILED_TIMEOUT)
    }, scanConfig.scanTimeout);
}

const finishScan = (reason: scanResult) => {
    scanRunning = false;
    if (scanTimeout) {
        clearTimeout(scanTimeout);
        scanTimeout = undefined;
    }
    if (releaseDeviceScanLatch) {
        releaseDeviceScanLatch();
        releaseDeviceScanLatch = undefined;
    }
    if (releaseCreateSocketLatch) {
        releaseCreateSocketLatch();
        releaseCreateSocketLatch = undefined;
    }
    aliveSockets.forEach((socket) => {
        cleanSocketCallbacks(socket);
        socket.close()
    });
    aliveSockets = [];
    stopProgress();
    scanFinishedCallback(reason);
}

const scanForNetworks = async (ipPattern: string) => {
    scanMessageSetter('Looking for networks...');
    foundNetworks = [];
    const ips = generateAllFromPattern(ipPattern);
    while(scanRunning && ips.length) {
        const ip = ips.shift();
        if (ip) {
            const socket = await createSocket(ip);
            if (socket) {
                const timeout = setTimeout(() => {
                    socket.onerror = () => {};
                    socket.close();
                }, scanConfig.socketTimeout);

                socket.onerror = () => {
                    const foundPattern = ip.replace(new RegExp(scanConfig.networkProbeLsb + '$'), 'x');
                    foundNetworks.push(foundPattern);
                    networkDetectedCallback(foundPattern);
                    clearTimeout(timeout);
                }

                socket.onopen = () => {
                    // @ts-ignore
                    socket.onerror();
                    socket.close();
                }

                const onCloseOriginalFunction = socket.onclose;
                socket.onclose = () => {
                    if (onCloseOriginalFunction) {
                        // @ts-ignore
                        onCloseOriginalFunction();
                    }
                    if (!aliveSockets.length) {
                        handleNetworksScanFinished();
                    }
                }
            }
        }
    }
}

const handleNetworksScanFinished = async () => {
    if (foundNetworks.length) {
        while (foundNetworks.length && scanRunning) {
            const ipPattern = foundNetworks.shift();
            if (ipPattern) {
                startProgress();
                setScanTimeout();
                await scanForDevices(ipPattern);
            }
        }
        if (scanRunning) {
            finishScan(scanResult.FAILED_DEVICES);
        }
    } else {
        finishScan(scanResult.FAILED_NETWORKS);
    }
}

const scanForDevices = async (ipPattern: string, failOnNoDevices: boolean = false) => {
    scanMessageSetter('Scanning ' + ipPattern);
    if (openSockets.length) {
        openSockets.forEach((socket) => socket.close());
        openSockets = [];
    }
    const ips = generateAllFromPattern(ipPattern);
    while(scanRunning && ips.length) {
        const ip = ips.shift();
        if (ip) {
            const socket = await createSocket(ip);
            if (socket) {
                const timeout = setTimeout(() => {
                    if (socket.readyState !== WebSocket.CLOSED) {
                        socket.close();
                    }
                }, scanConfig.socketTimeout);

                socket.onopen = () => {
                    openSockets.push(socket);
                    const deviceConnector = new ServerlessDeviceConnector(socket);
                    deviceConnector.onStateChange = (state) => {
                        if (state === ConnectionState.ready) {
                            connectedDevices.push(deviceConnector);
                            Router.addDevice(deviceConnector);
                        }
                    }
                    deviceDetectedCallback(ip);
                    clearTimeout(timeout);
                }

                const onCloseOriginalFunction = socket.onclose;
                socket.onclose = () => {
                    if (onCloseOriginalFunction) {
                        // @ts-ignore
                        onCloseOriginalFunction();
                    }
                    if (aliveSockets.length === openSockets.length) {
                        handleDeviceScanFinished(failOnNoDevices);
                    }
                }
            }
        }
    }
    const deviceScanLatch = new Promise((resolve) => releaseDeviceScanLatch = resolve);
    await deviceScanLatch;
}

const handleDeviceScanFinished = (failOnNoDevices: boolean) => {
    if (openSockets.length > 0) {
        openSockets.forEach((socket) => cleanSocketCallbacks(socket));
        aliveSockets = [];
        finishScan(scanResult.SUCCESS);
    } else if (failOnNoDevices) {
        finishScan(scanResult.FAILED_DEVICES);
    }
    if (releaseDeviceScanLatch) {
        releaseDeviceScanLatch();
    }
}

const cleanSocketCallbacks = (socket: WebSocket) => {
    socket.onopen = () => {};
    socket.onclose = () => {};
    socket.onerror = () => {};
}

const generateAllFromPattern = (ipPattern: string) => {
    const ips = [];
    for (let i = 0; i < 255; i++) {
        ips.push(ipPattern.replace('x', i.toString()));
    }
    return ips;
}

const createSocket = async (ip: string): Promise<WebSocket | undefined> => {
    if (scanRunning) {
        const socket = new WebSocket('ws://' + ip + ':' + CoreConfig.serverlessPort);
        await new Promise((res) => setTimeout(res, 0));
        if (socket.readyState === WebSocket.CLOSED) {
            const latch = new Promise((resolve) => releaseCreateSocketLatch = resolve);
            await latch;
            return createSocket(ip);
        } else {
            aliveSockets.push(socket);
            socket.onclose = () => {
                aliveSockets = aliveSockets.filter((sck) => sck !== socket);
                if (releaseCreateSocketLatch) {
                    releaseCreateSocketLatch();
                    releaseCreateSocketLatch = undefined;
                }
            }
            return socket;
        }
    } else {
        return undefined;
    }
}

const incrementProgress = () => {
    const value = progressValue < PROGRESS_MAX_COUNT ? progressValue + 1 : progressValue;
    progressValue = value;
    const percentComplete = 100 * value / PROGRESS_MAX_COUNT;
    progressValueSetter(percentComplete);
}

const startProgress = () => {
    progressValue = 0;
    progressValueSetter(progressValue);
    if (progressInterval === undefined) {
        const estimatedFinish = scanConfig.socketTimeout * 2;
        progressInterval = setInterval(incrementProgress, Math.ceil(estimatedFinish / PROGRESS_MAX_COUNT));
    }
}

const stopProgress = () => {
    if (progressInterval !== undefined) {
        clearInterval(progressInterval);
        progressInterval = undefined;
    }
}

const resetScan = () => {
    openSockets.forEach((socket) => socket.close());
    openSockets = [];
    connectedDevices = [];
}

const scanService = {
    startScan,
    finishScan,
    resetScan
};

export default scanService;