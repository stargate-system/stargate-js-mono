import {DeviceConnector} from "./DeviceConnector.js";
import {EventName} from "./EventName.js";
import {ValueMessage} from "gate-core";
import {SystemImage} from "./SystemImage";

export interface ControllerConnector{
    id: string | undefined,
    handleValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onDisconnect: () => void,
    handleDeviceEvent: (event: EventName, device: DeviceConnector) => void,
    handleJoined: (systemImage: SystemImage, connectedDevices: Array<string>) => void
}