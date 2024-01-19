import {ConnectionState, ConnectionType, DefaultConnection, Keywords, SocketWrapper} from "gate-core";
import {LocalDeviceConnector} from "./device/LocalDeviceConnector";
import {LocalControllerConnector} from "./controller/LocalControllerConnector";
import {WebSocketServer} from "ws";
import Router from "./Router";
import config from "../config";

export const initConnectionService = () => {
    const server = new WebSocketServer({port: config.connectionPort});
    server.on('connection', (socket, request) => {
        console.log("New connection from " + request.socket.remoteAddress);
        socket.on('error', console.log);
        const socketWrapper: SocketWrapper = {
            send: socket.send.bind(socket),
            close: socket.close.bind(socket),
            setOnClose: (callback) => socket.onclose = callback,
            setOnMessage: (callback) => socket.on('message', (ev: any) => callback(ev.toString()))
        }
        const connection = new DefaultConnection();
        connection.setConnected(socketWrapper);
        const stateListenerKey = connection.addStateChangeListener((state) => {
            if (state === ConnectionState.closed) {
                console.log("Connection from " + request.socket.remoteAddress + " failed");
            }
        });
        connection.functionalHandler.createQuery(Keywords.type).then((response) => {
            console.log("Connection type for " + request.socket.remoteAddress + " - " + response);
            switch (response) {
                case ConnectionType.device:
                    const deviceConnector = new LocalDeviceConnector(connection);
                    deviceConnector.onConnectorReady = () => Router.addDevice(deviceConnector);
                    break;
                case ConnectionType.controller:
                    const controllerConnector = new LocalControllerConnector(connection);
                    Router.addController(controllerConnector);
                    break;
                default:
                    connection.close();
            }
            connection.removeStateChangeListener(stateListenerKey);
        }).catch(() => {
            connection.close();
        });
    });
}