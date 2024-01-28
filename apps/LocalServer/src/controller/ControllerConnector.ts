import {ValueMessage} from "gate-core";
import {SystemImage} from "gate-core";
import {ValueMessageConsumer} from "../common/ValueMessageConsumer";

export interface ControllerConnector extends ValueMessageConsumer{
    id: string,
    sendValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onDisconnect: () => void,
    sendDeviceEvent: (event: string, data: string[]) => void,
    sendPipeEvent: (event: string, data: string[]) => void,
    onDeviceEvent: (event: string, data: string[]) => void,
    onPipeEvent: (event: string, data: string[]) => void,
    sendJoinData: (systemImage: SystemImage, connectedDevices: string[]) => void,
    onSubscribed: (ids: string[]) => void,
    onUnsubscribed: (ids: string[]) => void
}