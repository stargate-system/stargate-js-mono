import {ConnectionState, Manifest, ValueMessage} from "gate-core";
import {EventName} from "gate-router";

export interface SystemConnector {
    onDeviceEvent: ((event: EventName, data: Manifest | string) => void) | undefined,
    onValueMessage: ((message: ValueMessage) => void) | undefined,
    handleValueMessage: (message: ValueMessage) => void,
    onStateChange: ((state: ConnectionState) => void) | undefined
}