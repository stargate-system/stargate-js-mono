import scanConfig from "@/service/scanConfig";
import {scanResult, scanState, startProgress} from "@/service/scanService/scanService";
import {Dispatch, SetStateAction} from "react";
import {generateAllFromPattern, createSocket, helperState} from "@/service/scanService/helper";
import ScanService from "@/service/scanService/scanService";
import {scanForDevices} from "@/service/scanService/deviceScan";

let foundNetworks: string[] = [];

export const scanForNetworks = async (ipPattern: string,
                                      scanMessageSetter: Dispatch<SetStateAction<string>>,
                                      networkDetectedCallback: Function,
                                      deviceDetectedCallback: Function) => {
    scanMessageSetter('Looking for networks...');
    foundNetworks = [];
    const ips = generateAllFromPattern(ipPattern);
    while(scanState.scanRunning && ips.length) {
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
                    if (!helperState.aliveSockets.length) {
                        handleNetworksScanFinished(scanMessageSetter, deviceDetectedCallback);
                    }
                }
            }
        }
    }
}

const handleNetworksScanFinished = async (scanMessageSetter: Dispatch<SetStateAction<string>>,
                                          deviceDetectedCallback: Function) => {
    if (foundNetworks.length) {
        while (foundNetworks.length && scanState.scanRunning) {
            const ipPattern = foundNetworks.shift();
            if (ipPattern) {
                startProgress();
                await scanForDevices(ipPattern, scanMessageSetter, deviceDetectedCallback);
            }
        }
        if (scanState.scanRunning) {
            ScanService.finishScan(scanResult.FAILED_DEVICES);
        }
    } else {
        ScanService.finishScan(scanResult.FAILED_NETWORKS);
    }
}
