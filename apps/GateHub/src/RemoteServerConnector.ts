import {WebSocketServer, WebSocket} from 'ws';
import {
    Connection,
    ConnectionState,
    DefaultConnection,
    Keywords,
    SocketWrapper,
    MessageMapper,
    CoreConfig
} from "@stargate-system/core";
import remoteService from './RemoteService';
import dgram from 'dgram'
import express from 'express';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export class RemoteServerConnector {
    private readonly remoteIp: string;
    private readonly connection: Connection;
    private readonly onClose: () => void;
    private readonly onOpen: () => void;
    private readonly connections = new Map<string, WebSocket>();
    private stopDiscovery = () => {};
    private stopLocalServer = () => {};

    constructor(remoteIp: string, onClose: () => void, onOpen: () => void) {
        this.remoteIp = remoteIp;
        this.connection = new DefaultConnection(false);
        this.onClose = onClose;
        this.onOpen = onOpen;
        this.connectServer();
    }

    private connectServer = () => {
        const credentials = remoteService.getCredentials();
        const socket = new WebSocket('wss://' + this.remoteIp, {headers: {credentials: `${credentials.id};${credentials.password}`}});
        const socketWrapper: SocketWrapper = {
            send: socket.send.bind(socket),
            close: socket.close.bind(socket),
            setOnClose: (callback) => socket.on('close', callback),
            setOnMessage: (callback) => socket.on('message', (ev: any) => {
                callback(ev.toString());
            })
        }
        socket.onopen = () => {
            console.log('Remote connection established');
            this.onOpen();
            this.connection.setConnected(socketWrapper);
            this.connection.onValueMessage = (message) => {
                message.forEach((entry) => {
                    const [id, value] = entry;
                    const target = this.connections.get(id);
                    if (target) {
                        target.send(value);
                    } else {
                        this.connection.functionalHandler.sendCommand('connDown', [id]);
                    }
                });
            }
            this.connection.setReady();
            this.startLocal()
        }
        socket.on('error', console.log);
        socket.on('close', () => {
            this.onClose();
            this.stopLocal();
        });
    }

    private startLocalDiscovery = () => {
        const socket = dgram.createSocket('udp4');
        const message = Buffer.from(CoreConfig.discoveryKeyword + ':' + CoreConfig.connectionPort);
        socket.on('listening', () => {
            socket.setBroadcast(true);
            const interval = setInterval(() => {
                socket.send(message, 0, message.length, CoreConfig.discoveryPort, '255.255.255.255');
            }, CoreConfig.discoveryInterval);
            this.stopDiscovery = () => {
                clearInterval(interval);
                socket.close();
            }
        });

        socket.bind(11000);
    }

    private startLocalServer = () => {
        const app = express();
        const server = app.listen(CoreConfig.connectionPort);
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
        wsServer.on('connection', (socket) => {
            socket.on('error', console.log);
            const id = this.generateId();
            this.connections.set(id, socket);
            this.connection.functionalHandler.sendCommand('connUp', [id]);
            socket.onclose = () => {
                this.connections.delete(id);
                this.connection.functionalHandler.sendCommand('connDown', [id]);
            }
            socket.on('message', (ev: any) => {
                this.connection.sendValue([id, ev.toString()]);
            });
        });
        this.stopLocalServer = () => {
            server.close();
        }
    }

    private startLocal = () => {
        this.startLocalDiscovery();
        this.startLocalServer();
    }

    private stopLocal = () => {
        this.stopDiscovery();
        this.stopLocalServer();
    }

    private generateId = (): string => {
    if (this.connections.size === 0) {
        return '0';
    }
    const ids = Array.from(this.connections.keys())
        .map((key) => Number.parseInt(key))
        .sort((a, b) => a - b);
    if (ids[0] > 0) {
        return '0';
    }
    let previousId: number | undefined = undefined;
    for(const id of ids) {
        if (previousId === undefined) {
            previousId = id;
        } else {
            if (id - previousId > 1) {
                break;
            } else {
                previousId = id;
            }
        }
    }
    // @ts-ignore
    return (previousId + 1).toString();
}
}