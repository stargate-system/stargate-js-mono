import {createSocket, generateAllFromPattern, helperState} from "@/service/scanService/helper";
import scanConfig from "@/service/scanConfig";
import {ServerlessDeviceConnector} from "@/service/connectors/ServerlessDeviceConnector";
import {ConnectionState} from "gate-core";
import {Router} from "gate-router";
import {scanResult, scanState} from "@/service/scanService/scanService";
import ScanService from "@/service/scanService/scanService";

interface DeviceScanState {
    openSockets: WebSocket[],
    connectedDevices: ServerlessDeviceConnector[],
    releaseDeviceScanLatch?: Function
}

export const deviceScanState: DeviceScanState = {
    openSockets: [],
    connectedDevices: []
}

export const scanForDevices = async (ipPattern: string,
                                     scanMessageSetter: Function,
                                     deviceDetectedCallback: Function,
                                     failOnNoDevices: boolean = false) => {
    scanMessageSetter('Scanning ' + ipPattern);
    if (deviceScanState.openSockets.length) {
        deviceScanState.openSockets.forEach((socket) => socket.close());
        deviceScanState.openSockets = [];
    }
    const ips = generateAllFromPattern(ipPattern);
    while(scanState.scanRunning && ips.length) {
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
                    deviceScanState.openSockets.push(socket);
                    const deviceConnector = new ServerlessDeviceConnector(socket);
                    deviceConnector.onStateChange = (state) => {
                        if (state === ConnectionState.ready) {
                            deviceScanState.connectedDevices.push(deviceConnector);
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
                    if (helperState.aliveSockets.length === deviceScanState.openSockets.length) {
                        handleDeviceScanFinished(failOnNoDevices);
                    }
                }
            }
        }
    }
    const deviceScanLatch = new Promise((resolve) => deviceScanState.releaseDeviceScanLatch = resolve);
    await deviceScanLatch;
}

const handleDeviceScanFinished = (failOnNoDevices: boolean) => {
    if (deviceScanState.openSockets.length > 0) {
        helperState.aliveSockets = [];
        ScanService.finishScan(scanResult.SUCCESS);
    } else if (failOnNoDevices) {
        ScanService.finishScan(scanResult.FAILED_DEVICES);
    }
    if (deviceScanState.releaseDeviceScanLatch) {
        deviceScanState.releaseDeviceScanLatch();
    }
}