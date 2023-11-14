import {
    ConfigurableValueFactory,
    AbstractValue
} from "gate-core";
import {device} from "./api/GateDevice.js";
import logger from "./DeviceLogger.js";

const initializeValue = (value: AbstractValue<any>) => {
    if (device.isStarted) {
        logger.warning('Cannot initialize value (' + value.valueName + ') after device was started');
    } else {
        device.values.add(value, value.id);
        value.onLocalUpdate = () => device.sendValue(value);
    }
}

const ValueFactory = new ConfigurableValueFactory(initializeValue);

export default ValueFactory;
