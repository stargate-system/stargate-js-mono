import {EventName} from "../constants/EventName.js";
import {ValueMessage} from "gate-core";
import {SystemImage} from "../interfaces/SystemImage";
import {Device} from "../components/deviceContext/Device";
import {ValueMessageConsumer} from "../interfaces/ValueMessageConsumer";

export interface ControllerConnector extends ValueMessageConsumer{
    id: string,
    sendValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onDisconnect: () => void,
    sendDeviceEvent: (event: EventName, device: Device) => void,
    sendJoinData: (systemImage: SystemImage, connectedDevices: string[]) => void,
    onSubscribed: (ids: string[]) => void,
    onUnsubscribed: (ids: string[]) => void
}