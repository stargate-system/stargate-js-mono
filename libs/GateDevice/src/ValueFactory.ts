import {
    ConfigurableValueFactory,
    Directions,
    AbstractValue
} from "gate-core";
import {state} from "./api/GateDevice.js";
import logger from "./DeviceLogger.js";

const initializeValue = (value: AbstractValue<any>, direction: Directions, name?: string) => {
    if (state.isStarted) {
        logger.warning('Cannot initialize value (' + value.valueName + ') after device was started');
    } else {
        value.valueName = name;
        state.values.add(value, value.id);
        value.direction = direction;
        value.onLocalUpdate = () => state.outputBuffer.add(value);
    }
}

const ValueFactory = new ConfigurableValueFactory(initializeValue);

export default ValueFactory;
