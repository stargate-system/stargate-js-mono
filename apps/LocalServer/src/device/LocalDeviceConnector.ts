import {
    Connection,
    ConnectionState,
    Keywords,
    ValidManifest
} from "gate-core";
import {DeviceConnector} from "./DeviceConnector";
import Router from "../Router";
import {Device} from "./Device";

export class LocalDeviceConnector implements DeviceConnector{
    private _id?: string;
    private readonly _connection: Connection;
    private _manifest?: ValidManifest;

    constructor(connection: Connection) {
        this._connection = connection;
        this.performHandshake();
    }

    private performHandshake = async () => {
        const functionalHandler = this._connection.functionalHandler;
        if (this._connection.state === ConnectionState.connected) {
            const manifestString = await functionalHandler
                .createQuery(Keywords.manifest)
                .catch(() => this._connection.close());
            if (manifestString !== undefined) {
                try {
                    const manifest = JSON.parse(manifestString);
                    if (manifest.id === undefined) {
                        this._manifest = await Router.systemRepository.createDevice(manifest);
                        functionalHandler.sendCommand(Keywords.assignedId, [this._manifest.uuid]);
                    } else {
                        manifest.uuid = manifest.id;
                        this._manifest = await Router.systemRepository.updateDevice(manifest);
                    }
                    // @ts-ignore
                    this._id = this._manifest.id;
                    new Device(this);
                } catch (err) {
                    console.log("Failed connection (on handshake)", err);
                    this._connection.close();
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