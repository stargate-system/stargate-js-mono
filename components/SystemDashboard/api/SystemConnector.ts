import {ConnectionState, Manifest, ValueMessage} from "gate-core";
import {EventName, SystemImage} from "gate-router";

export interface SystemConnector {
    onDeviceEvent?: (event: EventName, data: Manifest | string) => void,
    onValueMessage?: (message: ValueMessage) => void,
    handleValueMessage: (message: ValueMessage) => void,
    onStateChange?: (state: ConnectionState) => void,
    onJoinEvent: (systemImage: SystemImage, connectedDevices: Array<string>) => void,
    joinSystem: () => {}
}