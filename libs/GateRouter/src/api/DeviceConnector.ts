import {Connector} from "./Connector";
import {Manifest} from "gate-core";

export interface DeviceConnector extends Connector{
    id: string
    manifest: Manifest | undefined
}