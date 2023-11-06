import {Connector} from "./Connector";
import {DeviceConnector} from "./DeviceConnector";
import {RouterEvent} from "./RouterEvent";

export interface ControllerConnector extends Connector{
    handleDeviceEvent: (event: RouterEvent, device: DeviceConnector) => void;
}