import {
    ConfigurableValueFactory,
    Directions,
    GateValue
} from "gate-core";
import {state} from "./GateDevice.js";
import logger from "./logger/logger.js";

const initializeValue = (value: GateValue<any>, direction: Directions, name?: string) => {
    if (state.isStarted) {
        logger.logWarning('Cannot initialize value (' + value.valueName + ') after device was started');
    } else {
        value.valueName = name;
        state.values.add(value, value.id);
        value.direction = direction;
        value.onLocalUpdate = () => state.outputBuffer.add(value);
    }
}

const ValueFactory = new ConfigurableValueFactory(initializeValue);

export default ValueFactory;
