import {GateValue, ConnectionState, ValueMessage} from "gate-core";
import {EventName, SystemImage} from "gate-router";

export interface SystemConnector {
    state: ConnectionState,
    sendValue: (gateValue: GateValue<any>) => void,
    unsubscribe: (id: string) => void,
    subscribe: (id: string) => void,
    removeDevice: (id: string) => void,
    joinSystem: () => void,
    disconnect: () => void,
    getCurrentPing: () => number | undefined
    addStateChangeListener: (callback: (state: ConnectionState) => void) => string,
    removeStateChangeListener: (listenerKey: string) => void,
    onDeviceEvent?: (event: EventName, data: string[]) => void,
    onValueMessage?: (message: ValueMessage) => void,
    onJoinEvent: (systemImage: SystemImage, connectedDevices: Array<string>) => void,
}