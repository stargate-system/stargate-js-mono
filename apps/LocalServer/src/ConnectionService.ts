import {ConnectionState, ConnectionType, DefaultConnection, Keywords, SocketWrapper} from "@stargate-system/core";
import {LocalDeviceConnector} from "./device/LocalDeviceConnector";
import {LocalControllerConnector} from "./controller/LocalControllerConnector";
import {WebSocketServer} from "ws";
import Router from "./Router";
import config from "../config";
import { Server } from "http";

export const initConnectionService = (server: Server) => {
    const wsServer = new WebSocketServer({server});
    wsServer.on('connection', (socket, request) => {
        console.log("New connection from " + request.socket.remoteAddress);
        socket.on('error', console.log);
        const socketWrapper: SocketWrapper = {
            send: socket.send.bind(socket),
            close: () => {
                socket.removeAllListeners();
                socket.close();
            },
            setOnClose: (callback) => socket.onclose = callback,
            setOnMessage: (callback) => socket.on('message', (ev: any) => callback(ev.toString()))
        }
        const connection = new DefaultConnection(true);
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
                    new LocalDeviceConnector(connection);
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