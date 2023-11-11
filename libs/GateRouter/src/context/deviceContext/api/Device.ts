import {DeviceConnector} from "./DeviceConnector";
import {ValidManifest} from "./ValidManifest";

export interface Device extends DeviceConnector {
    id: string,
    manifest: ValidManifest
}