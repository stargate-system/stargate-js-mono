import {Connection, ConnectionState, ConnectionType, DefaultConnection, Keywords, SocketWrapper} from "@stargate-system/core";
import {LocalDeviceConnector} from "./device/LocalDeviceConnector";
import {LocalControllerConnector} from "./controller/LocalControllerConnector";
import {WebSocketServer, WebSocket} from "ws";
import Router from "./Router";
import { IncomingMessage, Server } from "http";
import { authenticate, getRemoteAccessPointById } from "./RemoteService";
import { RemoteControllerConnector } from "./controller/RemoteControllerConnector";

const hubConnections = new Map<string, Connection>();

export const initConnectionService = (server: Server, authenticated: boolean) => {
    const wsServer = new WebSocketServer({server});
    server.on('close', () => {
        wsServer.clients.forEach((client) => {
            client.close();
        });
        wsServer.close((err) => {
            if (err) {
                console.log('On closing WS Server', err)
            }
        });
    });
    wsServer.on('connection', (socket, request) => {
        if (authenticated) {
            if (request.headers.cookie) {
                if (authenticateCookie(request.headers.cookie)) {
                    createDirectConnection(socket, request, true);
                } else {
                    socket.close();
                    console.log(`Connection from ${request.socket.remoteAddress} denied`);
                } 
            } else if (request.headers.credentials) {
                const remoteId = authenticateCredentials(request.headers.credentials);
                if (remoteId) {
                    const existingConnection = hubConnections.get(remoteId);
                    if (existingConnection) {
                        console.log(`Closing existing connection for ${remoteId}`);
                        existingConnection.close();
                    }
                    createHubConnection(socket, request, remoteId);
                    
                } else {
                    socket.close();
                    console.log(`Connection from ${request.socket.remoteAddress} denied`);
                }
            } else {
                socket.close();
            }   
        } else {
            createDirectConnection(socket, request, false);
        }
    });
}

const authenticateCookie = (cookies: string) => {
    const result = cookies.split(';')
        .map((cookie) => {
            return cookie.trim().split('=');
        })
        .filter((cookie) => cookie[0] === 'stargate_client')
        .map((cookie) => {
            return decodeURIComponent(cookie[1]);
        });
    
    try {
        if (cookies.length === 0 || !authenticate(JSON.parse(result[0]))) {
            return false;
        };
    } catch(err) {
        console.log('On WebSocket authentication', err);
        return false;
    }
    return true;
}

const authenticateCredentials = (credentialsHeader: string | string[]) => {
    if (!(credentialsHeader instanceof Array)) {
        const credentials = credentialsHeader.split(';');
        if (credentials.length === 2) {
            const storedRemote = getRemoteAccessPointById(credentials[0]);
            if (storedRemote && storedRemote.password === credentials[1]) {
                return credentials[0];
            }
        }
    }
    console.log(`Remote authentication failed for ${credentialsHeader}`);
    return undefined;
}

const createDirectConnection = (socket: WebSocket, request: IncomingMessage, authenticated: boolean) => {
    const connectionId = request.socket.remoteAddress;
    console.log("New connection from " + connectionId);
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
    createConnection(socketWrapper, authenticated, connectionId);
}

interface VirtualConnectionCallbacks {
    closeCallback: (() => void),
    messageCallback: ((message: string) => void)
}

const createHubConnection = (socket: WebSocket, request: IncomingMessage, remoteId: string) => {
    const virtualConnections = new Map<string, VirtualConnectionCallbacks>();
    const connectionId = request.socket.remoteAddress;
    console.log(`New remote connection from ${remoteId} on ${connectionId}`);
    socket.on('error', console.log);
    const socketWrapper: SocketWrapper = {
        send: socket.send.bind(socket),
        close: () => {
            socket.removeAllListeners();
            socket.close();
        },
        setOnClose: (callback) => socket.onclose = callback,
        setOnMessage: (callback) => socket.on('message', (ev: any) => {
            callback(ev.toString());
        })
    }
    const connection = new DefaultConnection(true);
    hubConnections.set(remoteId, connection);
    connection.setConnected(socketWrapper);
    connection.addStateChangeListener((state) => {
        if (state === ConnectionState.closed) {
            console.log(`Remote ${remoteId} disconnected`);
            hubConnections.delete(remoteId);
            Array.from(virtualConnections.values()).forEach((conn) => {
                conn.closeCallback();
            });
        }
    });
    
    connection.functionalHandler.addCommandListener('connUp', (params) => {
        if (params && params[0]) {
            const id= params[0];
            const existingConnection = virtualConnections.get(id);
            if (existingConnection) {
                existingConnection.closeCallback();
                virtualConnections.delete(id);
            }
            const callbacks: VirtualConnectionCallbacks = {closeCallback: () => {}, messageCallback: () => {}}
            virtualConnections.set(id, callbacks);
            createVirtualConnection(id, connection, callbacks);
        }
    });
    connection.functionalHandler.addCommandListener('connDown', (params) => {
        if (params && params[0]) {
            const id= params[0];
            const existingConnection = virtualConnections.get(id);
            if (existingConnection) {
                existingConnection.closeCallback();
                virtualConnections.delete(id);
            }
        }
    });
    connection.onValueMessage = (message) => {
        message.forEach((entry) => {
            const [id, value] = entry;
            const existingConnection = virtualConnections.get(id);
            if (existingConnection) {
                existingConnection.messageCallback(value);
            }
        });
    }
    connection.setReady();
}

const createVirtualConnection = (id: string, connection: Connection, callbacks: VirtualConnectionCallbacks) => {
    const socketWrapper: SocketWrapper = {
        send: (message) => {
            connection.sendValue([id, message]);
        },
        close: () => callbacks.closeCallback(),
        setOnClose: (callback) => callbacks.closeCallback = callback,
        setOnMessage: (callback) => callbacks.messageCallback = callback
    }
    createConnection(socketWrapper, false, `Remote ${id}`);
}

export const createConnection = (socketWrapper: SocketWrapper, authenticated: boolean, connectionId: string | undefined) => {
    const connection = new DefaultConnection(true);
    connection.setConnected(socketWrapper);
    const stateListenerKey = connection.addStateChangeListener((state) => {
        if (state === ConnectionState.closed) {
            console.log("Connection from " + connectionId + " failed");
        }
    });
    connection.functionalHandler.createQuery(Keywords.type).then((response) => {
        console.log("Connection type for " + connectionId + " - " + response);
        switch (response) {
            case ConnectionType.device:
                new LocalDeviceConnector(connection);
                break;
            case ConnectionType.controller:
                const controllerConnector = authenticated
                    ? new RemoteControllerConnector(connection)
                    : new LocalControllerConnector(connection);
                    
                Router.addController(controllerConnector);
                break;
            default:
                connection.close();
        }
        connection.removeStateChangeListener(stateListenerKey);
    }).catch(() => {
        connection.close();
    });
    return connection;
}