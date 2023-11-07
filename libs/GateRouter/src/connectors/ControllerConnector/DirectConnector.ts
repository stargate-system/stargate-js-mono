import {ControllerConnector} from "../../api/ControllerConnector";
import {EventName} from "../../api/EventName";
import {DeviceConnector} from "../../api/DeviceConnector";
import {ValueMessage} from "gate-core";

export class DirectConnector implements ControllerConnector {
    id: string | undefined;
    onValueMessage: (message: ValueMessage) => void = () => {};
    onDisconnect: () => void = () => {};

    constructor(id: string) {

    }

    handleDeviceEvent(event: EventName, device: DeviceConnector): void {
    }

    handleValueMessage(valueMessage: ValueMessage): void {
    }
}