import {SerialPort} from "serialport";
import {ReadlineParser} from "@serialport/parser-readline";
import {Connection, ConnectionState, DefaultConnection, SocketWrapper} from "gate-core";
import DiscoveryService from "./DiscoveryService";
import discoveryService from "./DiscoveryService";
import {WebSocket} from 'ws';
import config from "../config";

export class LocalServerConnector {
    private readonly serialPort: SerialPort;
    private readonly connection: Connection;
    private handshakeDone = false;
    private handshakeFailedAttempts = 0;
    private timeout?: NodeJS.Timeout;
    private forwardDeviceMessage?: (message: string) => void;
    private portClosed = false;

    constructor(serialPort: SerialPort) {
        this.serialPort = serialPort;
        this.connection = new DefaultConnection(true);
        this.connection.addStateChangeListener((state) => {
            if (state !== ConnectionState.ready) {
                this.serialPort.write("*!notReady\n");
            }
        });
        const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
        parser.on('data', (data) => {
            const message = data as string;
            this.handleSerialMessage(message);
        });
        serialPort.on('error', (err) => {
            console.log('Error: ', err.message)
        });
        serialPort.on('open', () => {
            console.log("Port opened " + serialPort.path);
            this.performHandshake();
        });
        serialPort.on('close', () => {
            this.portClosed = true;
            parser.destroy();
            this.connection.close();
            console.log("Port closed " + serialPort.path);
        });
    }

    private performHandshake = () => {
        this.timeout = setTimeout(() => {
            this.handshakeFailedAttempts++;
            if (this.handshakeFailedAttempts > 3) {
                this.serialPort.close();
            } else {
                this.performHandshake();
            }
        }, 1000);
        this.serialPort.write("*?type\n");
    }

    private handleSerialMessage = (message: string) => {
        if (!this.handshakeDone) {
            if (message === "*>type|device") {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = undefined;
                }
                this.handshakeDone = true;
                this.connectServer();
            }
        } else {
            if (this.forwardDeviceMessage) {
                this.forwardDeviceMessage(message);
            }
        }
    }

    private connectServer = () => {
        const DISCOVERY_INTERVAL = process.env.DISCOVERY_INTERVAL ? Number.parseInt(process.env.DISCOVERY_INTERVAL) : config.discoveryInterval;

        if (DiscoveryService.getServerAddress() === undefined) {
            this.timeout = setTimeout(this.connectServer, DISCOVERY_INTERVAL);
        } else {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = undefined;
            }
            const socket = new WebSocket('ws://' + discoveryService.getServerAddress());
            const socketWrapper: SocketWrapper = {
                send: socket.send.bind(socket),
                close: socket.close.bind(socket),
                setOnClose: (callback) => socket.on('close', callback),
                setOnMessage: (callback) => socket.on('message', (ev: any) => {
                    const message = ev.toString();
                    this.forwardServerMessage(message);
                    callback(message);
                })
            }
            socket.onopen = () => {
                this.forwardDeviceMessage = socket.send.bind(socket);
                this.connection.setConnected(socketWrapper);
            }
            socket.on('error', console.log);
            socket.on('close', () => {
                if (!this.portClosed) {
                    console.log('Reconnecting ' + this.serialPort.path);
                    this.forwardDeviceMessage = undefined;
                    setTimeout(this.connectServer, 5000);
                }
            });
        }
    }

    private forwardServerMessage = (message: string) => {
        if (message !== "*>ping|1") {
            this.serialPort.write(message + '\n');
        }
    }
}