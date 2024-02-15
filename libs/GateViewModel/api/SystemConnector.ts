import {
    SystemImage,
    Connection
} from "gate-core";

export interface SystemConnector {
    connection: Connection,
    joinSystem: () => void,
    disconnect: () => void,
    subscribe: (id: string) => void,
    unsubscribe: (id: string) => void,
    sendDeviceEvent: (event: string, params: string[]) => void,
    sendPipeEvent: (event: string, params: string[]) => void,
    getCurrentPing: () => number | undefined
    onDeviceEvent: (event: string, data: string[]) => void,
    onPipeEvent: (event: string, data: string[]) => void,
    onJoinEvent: (systemImage: SystemImage, connectedDevices: string[]) => void
}