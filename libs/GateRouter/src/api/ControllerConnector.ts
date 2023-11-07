import {Connector} from "./Connector";
import {DeviceConnector} from "./DeviceConnector";
import {EventName} from "./EventName";

export interface ControllerConnector extends Connector{
    handleDeviceEvent: (event: EventName, device: DeviceConnector) => void;
}