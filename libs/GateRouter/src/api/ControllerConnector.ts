import {DeviceConnector} from "./DeviceConnector.js";
import {EventName} from "./EventName.js";
import {ValueMessage} from "gate-core";

export interface ControllerConnector{
    id: string | undefined,
    handleValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onDisconnect: () => void,
    handleDeviceEvent: (event: EventName, device: DeviceConnector) => void
}