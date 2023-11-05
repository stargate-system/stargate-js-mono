// @ts-ignore
import { WebSocketServer } from 'ws';
import config from "../../../config.js";
import {Connection, Keywords} from 'gate-core'
import {state} from "../../GateDevice.js";
import {ConnectionState} from "gate-core";

interface WebSocketInterface {
    close: () => void,
    onclose: () => void,
    on: (key: string, handler: Function) => void,
    send: (message: string) => void
}

export const initServerless = (onValueMessage: (changes: Array<[string, string]>) => void) => {
    const server = new WebSocketServer({port: config.port});
    server.on('connection', (socket: WebSocketInterface) => handleConnection(socket, onValueMessage));
}

// const setHandshakeListeners = (connection: Connection) => {
//     const functionalHandler = connection.socketHandler?.functionalHandler;
//     if (functionalHandler) {
//         functionalHandler.addQueryListener(Keywords.manifest, (respond: (response: string) => void) => {
//             respond(JSON.stringify(state.manifest));
//         });
//     }
// }

const handleConnection = (socket: WebSocketInterface, onValueMessage: (changes: Array<[string, string]>) => void) => {
    if (state.connection && state.connection.state !== ConnectionState.closed) {
        socket.close();
    } else {
        const onMessageSetter = (messageHandler: (msg: string) => void) => socket.on('message', messageHandler);
        const onCloseSetter = (closeHandler: () => void) => socket.onclose = closeHandler;
        state.connection = new Connection(
            socket.send,
            socket.close,
            onMessageSetter,
            onCloseSetter,
            onValueMessage)
    }
};
