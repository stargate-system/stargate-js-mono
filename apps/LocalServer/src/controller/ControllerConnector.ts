import {EventName} from "gate-core";
import {ValueMessage} from "gate-core";
import {SystemImage} from "gate-core";
import {ValueMessageConsumer} from "../common/ValueMessageConsumer";

export interface ControllerConnector extends ValueMessageConsumer{
    id: string,
    sendValueMessage: (valueMessage: ValueMessage) => void,
    onValueMessage: (valueMessage: ValueMessage) => void,
    onDisconnect: () => void,
    sendDeviceEvent: (event: EventName, data: string[]) => void,
    sendJoinData: (systemImage: SystemImage, connectedDevices: string[]) => void,
    onSubscribed: (ids: string[]) => void,
    onUnsubscribed: (ids: string[]) => void,
    onDeviceRemoved: (id: string) => void,
    onDeviceRenamed: (id: string, newName: string) => void,
    onPipeCreated: (pipe: [string, string]) => void,
    onPipeRemoved: (pipe: [string, string]) => void,
    onAddedToGroup: (groupName: string | undefined, deviceIds: string[]) => void
}