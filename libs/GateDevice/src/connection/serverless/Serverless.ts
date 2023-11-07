// @ts-ignore
import {WebSocketServer} from 'ws';
import config from "../../../config.js";
import {ConnectionState, Keywords, ValueMessage} from 'gate-core'
import {state} from "../../api/GateDevice.js";

interface WebSocketInterface {
    close: () => void,
    onclose: () => void,
    on: (key: string, handler: Function) => void,
    send: (message: string) => void
}

export const initServerless = (onValueMessage: (changes: ValueMessage) => void) => {
    const server = new WebSocketServer({port: config.port});
    server.on('connection', (socket: WebSocketInterface) => handleConnection(socket, onValueMessage));
};

const setHandshakeListeners = () => {
    const connectionStateListenerKey = state.connection.addStateChangeListener(() => {
        clearHandshakeListeners(connectionStateListenerKey);
    })
    const functionalHandler = state.connection.handler?.getFunctionalHandler();
    if (functionalHandler) {
        functionalHandler.addQueryListener(Keywords.manifest, (respond: (response: string) => void) => {
            respond(JSON.stringify(state.manifest));
        });
        functionalHandler.addCommandListener(Keywords.ready, () => {
            clearHandshakeListeners(connectionStateListenerKey);
            state.connection.setState(ConnectionState.ready);
        });
    } else {
        throw new Error('On setting handshake listeners: no functionalHandler');
    }
};

const clearHandshakeListeners = (connectionStateListenerKey: string) => {
    state.connection.removeStateChangeListener(connectionStateListenerKey);
    const functionalHandler = state.connection.handler?.getFunctionalHandler();
    if (functionalHandler) {
        functionalHandler.removeQueryListener(Keywords.manifest);
        functionalHandler.removeCommandListener(Keywords.ready);
    }
};

const handleConnection = (socket: WebSocketInterface, onValueMessage: (changes: ValueMessage) => void) => {
    if (state.connection.state !== ConnectionState.closed) {
        socket.close();
    } else {
        const onMessageSetter = (messageHandler: (msg: string) => void) => socket.on('message', (ev: any) => {
            messageHandler(ev.toString());
        });
        const onCloseSetter = (closeHandler: () => void) => socket.onclose = closeHandler;
        state.connection.setConnected(
            (msg: string) => socket.send(msg),
            () => socket.close(),
            onMessageSetter,
            onCloseSetter,
            onValueMessage);
        setHandshakeListeners();
    }
};
