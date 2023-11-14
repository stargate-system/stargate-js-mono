import {ConnectionState, Manifest, ValueMessage} from "gate-core";

export interface DeviceConnector{
    id?: string,
    sendValue: (value: [string, string]) => void,
    onValueMessage?: (valueMessage: ValueMessage) => void,
    onStateChange?: (state: ConnectionState) => void,
    manifest?: Manifest
}