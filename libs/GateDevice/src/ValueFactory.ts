import {Directions, GateBoolean, GateNumber, GateString, GateValue, ValueTypes} from "gate-core";
import {state} from "./GateDevice";
import logger from "./logger/logger";

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

const createBoolean = (direction: Directions, name?: string): GateBoolean => {
    const gateValue = new GateBoolean();
    initializeValue(gateValue, direction, name);
    return gateValue;
}

const createString = (direction: Directions, name?: string): GateString => {
    const gateValue = new GateString();
    initializeValue(gateValue, direction, name);
    return gateValue;
}

const createInteger = (direction: Directions, name?: string, range?: [number | undefined, number | undefined]): GateNumber => {
    const gateValue = new GateNumber(ValueTypes.integer);
    if (range !== undefined) {
        gateValue.setRange(range);
    }
    initializeValue(gateValue, direction, name);
    return gateValue;
}

const createFloat = (direction: Directions, name?: string, range?: [number | undefined, number | undefined]): GateNumber => {
    const gateValue = new GateNumber(ValueTypes.float);
    if (range !== undefined) {
        gateValue.setRange(range);
    }
    initializeValue(gateValue, direction, name);
    return gateValue;
}

const ValueFactory = {
    createBoolean,
    createString,
    createInteger,
    createFloat
}

export default ValueFactory;
