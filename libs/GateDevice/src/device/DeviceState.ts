import {ConnectionState} from "gate-core";

export interface DeviceState {
    current: ConnectionState,
    onStateChange?: (state: ConnectionState) => void
}