import ValueTypes from "./valueTypes/ValueTypes.js";
import Directions from "./directionTypes/Directions.js";
import {GateBoolean} from "./valueTypes/GateBoolean.js";
import {GateNumber} from "./valueTypes/GateNumber.js";
import {GateString} from "./valueTypes/GateString.js";
import {GateInput} from "./directionTypes/GateInput.js";
import {GateOutput} from "./directionTypes/GateOutput.js";
import OutputBuffer from "../messaging/OutputBuffer.js";
import {getOppositeDirection} from "./helper.js";

const createValue = (direction, valueType, name, settings, id) => {
    let type;
    switch (valueType) {
        case ValueTypes.boolean:
            type = new GateBoolean(name, id);
            break;
        case ValueTypes.number:
            type = new GateNumber(name, id);
            if (settings) {
                type.applySettings(settings);
            }
            break;
        case ValueTypes.string:
            type = new GateString(name, id);
            break;
        default:
            throw new Error('Value creation failed for name ' + name + ' - unknown type: ' + valueType);
    }
    let value;
    if (type) {
        switch (direction) {
            case Directions.input:
                value = new GateInput(type);
                ValueFactory.valuesMap[type.id] = type;
                ValueFactory.inputValues.push(value);
                break;
            case Directions.output:
                value = new GateOutput(type, (source) => OutputBuffer.add(source));
                ValueFactory.outputValues.push(value);
                break;
            default:
                throw new Error('Value creation failed for name ' + name + ' - unknown direction: ' + direction);
        }
    }
    return value;
};

const createFromManifest = (manifest, reverseDirection) => {
    const direction = reverseDirection ? getOppositeDirection(manifest.direction) : manifest.direction;
    return createValue(direction, manifest.type, manifest.name, manifest.settings);
}

const initializeAll = () => {
    ValueFactory.inputValues.forEach((value) => value.initialize());
    ValueFactory.outputValues.forEach((value) => value.initialize());
}

const createValuesManifest = () => {
    return {
        inputs: ValueFactory.inputValues.map((value) => value.toManifest()),
        outputs: ValueFactory.outputValues.map((value) => value.toManifest()),
    }
}

const ValueFactory = {
    valuesMap: {},
    inputValues: [],
    outputValues: [],
    createValue,
    createFromManifest,
    initializeAll,
    createValuesManifest
}

export default ValueFactory;