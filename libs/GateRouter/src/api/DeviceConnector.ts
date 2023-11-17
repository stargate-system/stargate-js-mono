import {Connection} from "gate-core";
import {ValidManifest} from "../interfaces/ValidManifest";

export interface DeviceConnector{
    id?: string,
    manifest?: ValidManifest,
    connection: Connection,
    onConnectorReady?: () => void
}