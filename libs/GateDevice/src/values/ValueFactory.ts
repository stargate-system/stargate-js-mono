import {
    GateValueFactory,
    Directions,
    ValueManifest,
    ValueTypes
} from "gate-core";
import {DeviceValue} from "./DeviceValue.js";
import {device} from "../device/GateDevice.js";

const createManifest = (type: ValueTypes, direction: Directions, name?: string): ValueManifest => {
    if (device.isStarted) {
        console.log(`WARNING: Value with name "${name}" created after device was started`);
    }
    return {
        type: type,
        direction: direction,
        valueName: name
    } as ValueManifest
}

const createAndWrap = <V>(manifest: ValueManifest) => {
    const gateValue = GateValueFactory.fromManifest(manifest);
    return new DeviceValue<V>(gateValue);
}

const createBoolean = (direction: Directions, name?: string, labelTrue?: string, labelFalse?: string): DeviceValue<boolean> => {
    const manifest = createManifest(ValueTypes.boolean, direction, name);
    manifest.options = {
        labelTrue,
        labelFalse
    }
    return createAndWrap(manifest);
}

const createString = (direction: Directions, name?: string, minimumLength?: number): DeviceValue<string> => {
    const manifest = createManifest(ValueTypes.string, direction, name);
    manifest.options = {
        minimumLength
    };
    return createAndWrap(manifest);
}

const createInteger = (direction: Directions, name?: string, range?: [number | undefined, number | undefined]): DeviceValue<number> => {
    const manifest = createManifest(ValueTypes.integer, direction, name);
    manifest.options = {
        range: range
    }
    return createAndWrap(manifest);
}

const createFloat = (direction: Directions, name?: string, range?: [number | undefined, number | undefined]): DeviceValue<number> => {
    const manifest = createManifest(ValueTypes.float, direction, name);
    manifest.options = {
        range: range
    }
    return createAndWrap(manifest);
}


const ValueFactory = {
    createBoolean,
    createFloat,
    createInteger,
    createString
};

export default ValueFactory;
