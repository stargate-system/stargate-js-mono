import {DeviceConnector} from "../../deviceContext/api/DeviceConnector.js";
import {EventName} from "../../../api/EventName.js";
import {ValueMessage} from "gate-core";
import {SystemImage} from "../../../api/SystemImage";

export interface ControllerConnector{
    id: string | undefined,
    handleValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onDisconnect: () => void,
    handleDeviceEvent: (event: EventName, device: DeviceConnector) => void,
    handleJoined: (systemImage: SystemImage, connectedDevices: Array<string>) => void
}