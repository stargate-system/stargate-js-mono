import {Dispatch, SetStateAction} from "react";
import scanConfig from "@/service/scanConfig";
import {scanForNetworks} from "@/service/scanService/networksScan";
import {helperState} from "@/service/scanService/helper";
import {deviceScanState, scanForDevices} from "@/service/scanService/deviceScan";

const PROGRESS_MAX_COUNT = 300;
export enum scanResult {
    SUCCESS,
    FAILED_NETWORKS,
    FAILED_DEVICES,
    FAILED_TIMEOUT,
    ABORTED
}

let scanTimeout: NodeJS.Timeout | undefined;
let deviceDetectedCallback: Function;
let scanFinishedCallback: Function;
let progressValueSetter: Dispatch<SetStateAction<number>>;
let progressValue = 0;
let progressInterval: NodeJS.Timeout | undefined;

interface ScanState {
    scanRunning: boolean
}

export const scanState: ScanState = {
    scanRunning: false,
}

const startScan = (byte1: string,
                   byte2: string,
                   byte3: string,
                   onNetworkDetected: Function,
                   onDeviceDetected: Function,
                   onScanFinished: Function,
                   setScanMessage: Dispatch<SetStateAction<string>>,
                   setProgressValue: Dispatch<SetStateAction<number>>) => {
    deviceDetectedCallback = onDeviceDetected;
    scanFinishedCallback = onScanFinished;
    progressValueSetter = setProgressValue;
    scanState.scanRunning = true;
    if (byte3.length) {
        const ipPattern = byte1 + '.' + byte2 + '.' + byte3 + '.x';
        scanForDevices(ipPattern, setScanMessage, deviceDetectedCallback, true);
    } else {
        scanForNetworks(byte1 + '.' + byte2 + '.x.' + scanConfig.networkProbeLsb,
            setScanMessage, onNetworkDetected, onDeviceDetected);
    }
    startProgress();
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
    scanState.scanRunning = false;
    if (scanTimeout) {
        clearTimeout(scanTimeout);
        scanTimeout = undefined;
    }
    if (deviceScanState.releaseDeviceScanLatch) {
        deviceScanState.releaseDeviceScanLatch();
        deviceScanState.releaseDeviceScanLatch = undefined;
    }
    if (helperState.releaseCreateSocketLatch) {
        helperState.releaseCreateSocketLatch();
        helperState.releaseCreateSocketLatch = undefined;
    }
    helperState.aliveSockets.forEach((socket) => {
        cleanSocketCallbacks(socket);
        socket.close()
    });
    helperState.aliveSockets = [];
    stopProgress();
    scanFinishedCallback(reason);
}

const cleanSocketCallbacks = (socket: WebSocket) => {
    socket.onopen = () => {};
    socket.onclose = () => {};
    socket.onerror = () => {};
}

const incrementProgress = () => {
    const value = progressValue < PROGRESS_MAX_COUNT ? progressValue + 1 : progressValue;
    progressValue = value;
    const percentComplete = 100 * value / PROGRESS_MAX_COUNT;
    progressValueSetter(percentComplete);
}

export const startProgress = () => {
    progressValue = 0;
    progressValueSetter(progressValue);
    if (progressInterval === undefined) {
        const estimatedFinish = scanConfig.socketTimeout * 2;
        progressInterval = setInterval(incrementProgress, Math.ceil(estimatedFinish / PROGRESS_MAX_COUNT));
    }
    setScanTimeout();
}

const stopProgress = () => {
    if (progressInterval !== undefined) {
        clearInterval(progressInterval);
        progressInterval = undefined;
    }
}

const resetScan = () => {
    deviceScanState.openSockets.forEach((socket) => socket.close());
    deviceScanState.openSockets = [];
    deviceScanState.connectedDevices = [];
}

const scanService = {
    startScan,
    finishScan,
    resetScan
};

export default scanService;