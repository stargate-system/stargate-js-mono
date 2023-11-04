// @ts-ignore
import { WebSocketServer } from 'ws';
import config from "../../../config.js";
import {Commands} from 'gate-core'
import {state} from "../../GateDevice.js";
import {ConnectionStatus, closeConnection, initConnection, Connection} from "../Connection.js";

interface WebSocketInterface {
    close: () => void,
    on: (key: string, handler: Function) => void,
    send: (message: string) => void
}

export const initServerless = (connection: Connection) => {
    const server = new WebSocketServer({port: config.port});
    server.on('connection', (socket: WebSocketInterface) => handleConnection(socket, connection));
}

const setHandshakeListeners = (connection: Connection) => {
    const functionalHandler = connection.socketHandler?.functionalHandler;
    if (functionalHandler) {
        functionalHandler.addQueryListener(Commands.manifest, (respond) => {
            respond(JSON.stringify(state.manifest));
        });
    }
}

const handleConnection = (socket: WebSocketInterface, connection: Connection) => {
    if (connection.status !== ConnectionStatus.closed) {
        socket.close();
    } else {
        connection.status = ConnectionStatus.connected;
        const onMessage = initConnection((msg) => socket.send(msg));
        socket.on('message', onMessage);
        socket.on('close', closeConnection);
        setHandshakeListeners(connection);
    }
};
