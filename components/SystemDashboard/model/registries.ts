import {Registry} from "gate-core";
import {ObservableValue} from "./ObservableValue";
import {DeviceActiveState} from "./DeviceActiveState";

const gateValuesRegistry = new Registry<ObservableValue<any>>();
const deviceStateRegistry = new Registry<DeviceActiveState>();

const registries = {
    gateValuesRegistry,
    deviceStateRegistry
}

export default registries;
