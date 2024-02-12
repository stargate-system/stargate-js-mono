import {
    GateValueFactory,
    Directions,
    ValueManifest,
    ValueTypes,
    GateBoolean,
    GateString,
    GateNumber,
    GateSelect
} from "gate-core";
import {device} from "../device/GateDevice.js";

const createValue = (type: ValueTypes, direction: Directions) => {
    if (device.isStarted) {
        console.log(`WARNING: Value created while device is running`);
    }

    const manifest = {
        type,
        direction
    } as ValueManifest

    const gateValue = GateValueFactory.fromManifest(manifest);
    device.values.add(gateValue, gateValue.id);

    gateValue.onLocalUpdate = () => {
        if (gateValue.subscribed) {
            device.connection.sendGateValue(gateValue);
        }
    };
    gateValue.onRemoteUpdate = (wasChanged) => {
        if (gateValue.direction === Directions.input && wasChanged) {
            device.connection.sendGateValue(gateValue);
        }
    }
    gateValue.onSubscriptionChange = (subscribed) => {
        if (subscribed) {
            device.connection.sendGateValue(gateValue);
        }
    }
    return gateValue;
}

const createBoolean = (direction: Directions) => {
    return createValue(ValueTypes.boolean, direction) as GateBoolean;
}

const createString = (direction: Directions) => {
    return createValue(ValueTypes.string, direction) as GateString;
}

const createInteger = (direction: Directions) => {
    return createValue(ValueTypes.integer, direction) as GateNumber;
}

const createFloat = (direction: Directions) => {
    return createValue(ValueTypes.float, direction) as GateNumber;
}

const createSelect = (direction: Directions) => {
    return createValue(ValueTypes.select, direction) as GateSelect;
}

const ValueFactory = {
    createBoolean,
    createFloat,
    createInteger,
    createString,
    createSelect
};

export default ValueFactory;
