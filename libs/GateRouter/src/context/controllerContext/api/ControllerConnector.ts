import {EventName} from "../../../api/EventName.js";
import {ValueMessage} from "gate-core";
import {SystemImage} from "../../../api/SystemImage";
import {Device} from "../../deviceContext/api/Device";

export interface ControllerConnector{
    id?: string,
    sendValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onDisconnect: () => void,
    sendDeviceEvent: (event: EventName, device: Device) => void,
    sendJoinData: (systemImage: SystemImage, connectedDevices: string[]) => void
}