import {GateValue, ConnectionState, ValueMessage} from "gate-core";
import {EventName, SystemImage, ValidManifest} from "gate-router";

export interface SystemConnector {
    state: ConnectionState,
    onDeviceEvent?: (event: EventName, data: ValidManifest | string) => void,
    onValueMessage?: (message: ValueMessage) => void,
    sendValue: (gateValue: GateValue<any>) => void,
    subscribe: (id: string) => void,
    unsubscribe: (id: string) => void,
    addStateChangeListener: (callback: (state: ConnectionState) => void) => string,
    removeStateChangeListener: (listenerKey: string) => void,
    onJoinEvent: (systemImage: SystemImage, connectedDevices: Array<string>) => void,
    joinSystem: () => void,
    disconnect: () => void
}