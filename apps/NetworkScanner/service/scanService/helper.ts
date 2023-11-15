import {CoreConfig} from "gate-core";
import {scanState} from "@/service/scanService/scanService";

interface HelperState {
    aliveSockets: WebSocket[],
    releaseCreateSocketLatch?: Function
}

export const helperState: HelperState = {
    aliveSockets: [],
}

export const generateAllFromPattern = (ipPattern: string) => {
    const ips = [];
    for (let i = 0; i < 255; i++) {
        ips.push(ipPattern.replace('x', i.toString()));
    }
    return ips;
}

export const createSocket = async (ip: string): Promise<WebSocket | undefined> => {
    if (scanState.scanRunning) {
        const socket = new WebSocket('ws://' + ip + ':' + CoreConfig.serverlessPort);
        await new Promise((res) => setTimeout(res, 0));
        if (socket.readyState === WebSocket.CLOSED) {
            const latch = new Promise((resolve) => helperState.releaseCreateSocketLatch = resolve);
            await latch;
            return createSocket(ip);
        } else {
            helperState.aliveSockets.push(socket);
            socket.onclose = () => {
                helperState.aliveSockets = helperState.aliveSockets.filter((sck) => sck !== socket);
                if (helperState.releaseCreateSocketLatch) {
                    helperState.releaseCreateSocketLatch();
                    helperState.releaseCreateSocketLatch = undefined;
                }
            }
            return socket;
        }
    } else {
        return undefined;
    }
}
