import {
    Connection,
    ConnectionState,
    DefaultConnection,
    Keywords,
    SocketWrapper
} from "gate-core";
import {DeviceConnector, Router, ValidManifest} from "gate-router";

export class ServerlessDeviceConnector implements DeviceConnector{
    private _id?: string;
    private readonly _connection: Connection;
    private _manifest?: ValidManifest;
    onConnectorReady?: () => void;

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

        this.performHandshake();
    }

    private performHandshake = async () => {
        const functionalHandler = this._connection.functionalHandler;
        if (this._connection.state === ConnectionState.connected) {
            const manifestString = await functionalHandler
                .createQuery(Keywords.manifest)
                .catch(() => this._connection.close());
            if (manifestString !== undefined) {
                const manifest = JSON.parse(manifestString);
                this._manifest = await Router.systemRepository.createDevice(manifest);
                this._id = this._manifest.id;
                if (this.onConnectorReady) {
                    this.onConnectorReady();
                }
            }
        }
    }

    get id(): string | undefined {
        return this._id;
    }

    get manifest(): ValidManifest | undefined{
        return this._manifest;
    }

    get connection(): Connection {
        return this._connection;
    }
}