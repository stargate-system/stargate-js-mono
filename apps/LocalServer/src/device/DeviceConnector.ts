import {Connection, ValidManifest} from "gate-core";

export interface DeviceConnector{
    id?: string,
    manifest?: ValidManifest,
    connection: Connection
}