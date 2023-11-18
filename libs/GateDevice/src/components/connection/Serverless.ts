// @ts-ignore
import {WebSocketServer} from 'ws';
import {ConnectionState, CoreConfig, Keywords, SocketWrapper} from 'gate-core'
import {device} from "../../api/GateDevice.js";
import config from "../../api/config.js";

let handshakeTimeout: NodeJS.Timeout | undefined;

interface WebSocketInterface {
    close: () => void,
    onclose: () => void,
    on: (key: string, handler: Function) => void,
    send: (message: string) => void
}

export const initServerless = () => {
    const server = new WebSocketServer({port: CoreConfig.serverlessPort});
    server.on('connection', (socket: WebSocketInterface) => {
        const socketWrapper: SocketWrapper = {
            send: socket.send.bind(socket),
            close: socket.close.bind(socket),
            setOnClose: (callback) => socket.onclose = callback,
            setOnMessage: (callback) => socket.on('message', (ev: any) => callback(ev.toString()))
        }
        handleConnection(socketWrapper);
    });
};

const handleConnection = (socketWrapper: SocketWrapper) => {
    if (device.deviceState.state !== ConnectionState.closed) {
        socketWrapper.close();
    } else {
        device.connection.setConnected(socketWrapper);
        setHandshakeListeners();
    }
};

const setHandshakeListeners = () => {
    handshakeTimeout = setTimeout(() => {
        device.connection.close();
        handshakeTimeout = undefined;
    }, config.handShakeTimeout);

    const connectionStateListenerKey = device.connection.addStateChangeListener(() => {
        clearHandshakeListeners(connectionStateListenerKey);
    });
    const functionalHandler = device.connection.functionalHandler;
    functionalHandler.addQueryListener(Keywords.manifest, (respond: (response: string) => void) => {
        respond(JSON.stringify(device.manifest));
    });
    functionalHandler.addCommandListener(Keywords.ready, () => {
        device.connection.setReady();
    });
};

const clearHandshakeListeners = (connectionStateListenerKey: string) => {
    if (handshakeTimeout) {
        clearTimeout(handshakeTimeout);
        handshakeTimeout = undefined;
    }
    device.connection.removeStateChangeListener(connectionStateListenerKey);
    const functionalHandler = device.connection.functionalHandler;
    functionalHandler.removeQueryListener(Keywords.manifest);
    functionalHandler.removeCommandListener(Keywords.ready);
};

