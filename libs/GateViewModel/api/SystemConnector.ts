import {GateValue, ConnectionState, Manifest, ValueMessage} from "gate-core";
import {EventName, SystemImage} from "gate-router";

export interface SystemConnector {
    state: ConnectionState,
    onDeviceEvent?: (event: EventName, data: Manifest | string) => void,
    onValueMessage?: (message: ValueMessage) => void,
    sendValue: (gateValue: GateValue<any>) => void,
    onStateChange?: (state: ConnectionState) => void,
    onJoinEvent: (systemImage: SystemImage, connectedDevices: Array<string>) => void,
    joinSystem: () => void
}