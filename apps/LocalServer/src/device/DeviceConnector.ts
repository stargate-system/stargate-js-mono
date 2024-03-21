import {Connection, ValidManifest} from "@stargate-system/core";

export interface DeviceConnector{
    id?: string,
    manifest?: ValidManifest,
    connection: Connection
}