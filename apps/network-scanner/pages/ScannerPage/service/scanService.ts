import {Dispatch, SetStateAction} from "react";
import scanConfig from "@/pages/ScannerPage/service/scanConfig";

let scanRunning = false;
let scanTimeout: NodeJS.Timeout;
let networkDetectedCallback: Function;
let deviceDetectedCallback: Function;
let scanFinishedCallback: Function;
let scanMessageSetter: Dispatch<SetStateAction<string>>;
let progressValueSetter: Dispatch<SetStateAction<number>>;
let progressValue = 0;
let progressInterval: NodeJS.Timeout | undefined;
let aliveSockets: Array<WebSocket> = [];
const PROGRESS_TOTAL = 300;

let releaseCreateSocketLatch: Function | undefined;

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
        scanMessageSetter('Scanning ' + ipPattern);
        scanIpPattern(ipPattern);
    } else {
        scanMessageSetter('Looking for networks...');
        scanForNetworks(byte1 + '.' + byte2 + '.x.' + scanConfig.NETWORK_PROBE_LSB);
    }
    startProgress();
    scanTimeout = setTimeout(() => abortScan(), scanConfig.SCAN_TIMEOUT);
}

const abortScan = () => {
    scanRunning = false;
    if (scanTimeout) {
        clearTimeout(scanTimeout);
    }
    aliveSockets.forEach((socket) => socket.close());
    stopProgress();
    scanFinishedCallback();
}

const scanIpPattern = (ipPattern: string) => {

}

const scanForNetworks = async (ipPattern: string) => {
    const ips = generateAllFromPattern(ipPattern);
    while(scanRunning && ips.length) {
        const ip = ips.shift();
        if (ip) {
            const socket = await createSocket(ip);
            if (socket) {
                const timeout = setTimeout(() => {
                    socket.onerror = () => {};
                    socket.close();
                }, scanConfig.SOCKET_TIMEOUT);

                socket.onerror = () => {
                    networkDetectedCallback(ip);
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
                        abortScan();
                    }
                }
            }
        }
    }
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
        const socket = new WebSocket('ws://' + ip + ':' + scanConfig.PORT);
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
    const value = progressValue < PROGRESS_TOTAL ? progressValue + 1 : progressValue;
    progressValue = value;
    const percentComplete = 100 * value / PROGRESS_TOTAL;
    progressValueSetter(percentComplete);
}

const startProgress = () => {
    progressValue = 0;
    progressValueSetter(progressValue);
    if (progressInterval === undefined) {
        const estimatedFinish = scanConfig.SOCKET_TIMEOUT * 2;
        progressInterval = setInterval(incrementProgress, Math.ceil(estimatedFinish / PROGRESS_TOTAL));
    }
}

const stopProgress = () => {
    if (progressInterval !== undefined) {
        clearInterval(progressInterval);
        progressInterval = undefined;
    }
}

const scanService = {
    startScan,
    abortScan
};

export default scanService;