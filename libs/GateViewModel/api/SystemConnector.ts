import {
    GateValue,
    ConnectionState,
    ValueMessage,
    SystemImage
} from "gate-core";

export interface SystemConnector {
    state: ConnectionState,
    sendValue: (gateValue: GateValue<any>) => void,
    unsubscribe: (id: string) => void,
    subscribe: (id: string) => void,
    sendDeviceEvent: (event: string, params: string[]) => void,
    sendPipeEvent: (event: string, params: string[]) => void,
    joinSystem: () => void,
    disconnect: () => void,
    getCurrentPing: () => number | undefined
    addStateChangeListener: (callback: (state: ConnectionState) => void) => string,
    removeStateChangeListener: (listenerKey: string) => void,
    onDeviceEvent: (event: string, data: string[]) => void,
    onPipeEvent: (event: string, data: string[]) => void,
    onValueMessage: (message: ValueMessage) => void,
    onJoinEvent: (systemImage: SystemImage, connectedDevices: Array<string>) => void,
}