import {ConnectionState} from "gate-core";

export interface DeviceState {
    state: ConnectionState,
    onStateChange?: (state: ConnectionState) => void
}