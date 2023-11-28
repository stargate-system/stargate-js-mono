import {
    Connection,
    ConnectionState,
    DefaultConnection,
    Keywords,
    SocketWrapper
} from "gate-core";
import {DeviceConnector, Router, ValidManifest} from "gate-router";

export class LocalDeviceConnector implements DeviceConnector{
    private _id?: string;
    private readonly _connection: Connection;
    private _manifest?: ValidManifest;
    onConnectorReady?: () => void;

    constructor(socketWrapper: SocketWrapper) {
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
                if (manifest.id === undefined) {
                    this._manifest = await Router.systemRepository.createDevice(manifest);
                    functionalHandler.sendCommand(Keywords.assignedId, [this._manifest.id]);
                } else {
                    this._manifest = await Router.systemRepository.updateDevice(manifest);
                }
                // @ts-ignore
                this._id = this._manifest.id;
                if (this.onConnectorReady) {
                    this.onConnectorReady();
                }
            } else {
                this._connection.close();
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