import {EventName} from "../../../api/EventName.js";
import {ValueMessage} from "gate-core";
import {SystemImage} from "../../../api/SystemImage";
import {Device} from "../../deviceContext/api/Device";

export interface ControllerConnector{
    id?: string,
    handleValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onDisconnect: () => void,
    handleDeviceEvent: (event: EventName, device: Device) => void,
    handleJoined: (systemImage: SystemImage, connectedDevices: string[]) => void
}