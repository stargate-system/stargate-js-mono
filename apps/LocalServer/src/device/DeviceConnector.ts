import {Connection} from "gate-core";
import {ValidManifest} from "../common/ValidManifest";

export interface DeviceConnector{
    id?: string,
    manifest?: ValidManifest,
    connection: Connection,
    onConnectorReady?: () => void
}