import {ConnectionState, ConnectionType, DefaultConnection, Keywords, SocketWrapper} from "@stargate-system/core";
import {LocalDeviceConnector} from "./device/LocalDeviceConnector";
import {LocalControllerConnector} from "./controller/LocalControllerConnector";
import {WebSocketServer} from "ws";
import Router from "./Router";
import { Server } from "http";
import { authenticate } from "./RemoteService";


export const initConnectionService = (server: Server, authenticated: boolean) => {
    const wsServer = new WebSocketServer({server});
    server.on('close', () => wsServer.close((err) => {
        if (err) {
            console.log('On closing WS Server', err)
        }
    }));
    wsServer.on('connection', (socket, request) => {
        if (authenticated) {
            if (!request.headers.cookie) {
                socket.close();
                return;
            }
            const cookies = request.headers.cookie.split(';')
            .map((cookie) => {
                return cookie.trim().split('=');
            })
            .filter((cookie) => cookie[0] === 'stargate_client')
            .map((cookie) => decodeURIComponent(cookie[1]));
            
            try {
                if (cookies.length === 0 || !authenticate(JSON.parse(cookies[0]))) {
                    socket.close();
                    return;
                };
            } catch(err) {
                console.log('On WebSocket authentication', err);
                socket.close();
                return;
            }
        }
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