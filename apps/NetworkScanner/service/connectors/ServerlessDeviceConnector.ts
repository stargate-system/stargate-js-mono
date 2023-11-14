import {
    Connection,
    ConnectionState,
    DefaultConnection,
    Keywords,
    Manifest, SocketWrapper,
    ValueMessage
} from "gate-core";
import {DeviceConnector} from "gate-router";

export class ServerlessDeviceConnector implements DeviceConnector{
    id?: string;
    private readonly _connection: Connection;
    manifest?: Manifest;
    onValueMessage?: (change: ValueMessage) => void;
    onStateChange?: (state: ConnectionState) => void;

    constructor(socket: WebSocket) {
        const socketWrapper: SocketWrapper = {
            send: socket.send.bind(socket),
            close: socket.close.bind(socket),
            setOnClose: (callback: () => void) => {
                socket.onclose = callback;
            },
            setOnMessage: (callback: (message: string) => void) => {
                socket.onmessage = (ev) => callback(ev.data);
            }
        };

        this._connection = new DefaultConnection();
        this._connection.setConnected(socketWrapper)
        this._connection.addStateChangeListener((state) => {
            if (this.onStateChange) {
                this.onStateChange(state);
            }
        });
        this._connection.onValueMessage = (valueMessage: ValueMessage) => {
            if(this.onValueMessage) {
                this.onValueMessage(valueMessage);
            }
        }

        this.performHandshake();
    }

    private performHandshake = async () => {
        const functionalHandler = this._connection.functionalHandler;
        if (this._connection.state === ConnectionState.connected) {
            const manifestString = await functionalHandler
                .createQuery(Keywords.manifest)
                .catch(() => this._connection.close());
            if (manifestString !== undefined) {
                this.manifest = JSON.parse(manifestString);
                functionalHandler.sendCommand(Keywords.ready);
                this._connection.setReady();
            }
        }
    }


    get connection(): Connection {
        return this._connection;
    }

    sendValue = (value: [string, string]) => {
        this._connection.sendValue(value);
    }
}