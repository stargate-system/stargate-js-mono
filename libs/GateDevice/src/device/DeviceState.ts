import {ConnectionState} from "@stargate-system/core";

export interface DeviceState {
    current: ConnectionState,
    onStateChange?: (state: ConnectionState) => void
}