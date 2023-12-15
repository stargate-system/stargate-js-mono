import {WebSocketServer} from 'ws';
import {CoreConfig, SocketWrapper} from "gate-core";
import {LocalControllerConnector} from "./LocalControllerConnector";
import Router from "../Router";

export const initControllerService = () => {
    const server = new WebSocketServer({port: CoreConfig.localServerControllerPort});
    server.on('connection', (socket) => {
        socket.on('error', console.log);
        const socketWrapper: SocketWrapper = {
            send: socket.send.bind(socket),
            close: socket.close.bind(socket),
            setOnClose: (callback) => socket.onclose = callback,
            setOnMessage: (callback) => socket.on('message', (ev: any) => callback(ev.toString()))
        }
        const connector = new LocalControllerConnector(socketWrapper);
        Router.addController(connector);
    });
}