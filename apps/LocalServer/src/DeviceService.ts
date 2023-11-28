import {CoreConfig, SocketWrapper} from "gate-core";
import {LocalDeviceConnector} from "./LocalDeviceConnector";
import {Router} from "gate-router";
import {WebSocketServer, WebSocket} from "ws";

export const initDeviceService = () => {
    const server = new WebSocketServer({port: CoreConfig.localServerDevicePort});
    server.on('connection', (socket: WebSocket) => {
        socket.on('error', console.log);
        const socketWrapper: SocketWrapper = {
            send: socket.send.bind(socket),
            close: socket.close.bind(socket),
            setOnClose: (callback) => socket.onclose = callback,
            setOnMessage: (callback) => socket.on('message', (ev: any) => callback(ev.toString()))
        }
        handleConnection(socketWrapper);
    });
}

const handleConnection = (socketWrapper: SocketWrapper) => {
    const connector = new LocalDeviceConnector(socketWrapper);
    connector.onConnectorReady = () => Router.addDevice(connector);
}