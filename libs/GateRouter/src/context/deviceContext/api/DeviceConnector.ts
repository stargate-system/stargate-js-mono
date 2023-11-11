import {ConnectionState, Manifest, ValueMessage} from "gate-core";

export interface DeviceConnector{
    id: string | undefined,
    handleValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onStateChange: (state: ConnectionState) => void,
    manifest: Manifest | undefined
}