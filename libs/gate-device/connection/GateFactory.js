import logger from "../logger/logger.js";
import {startConnection} from "./Connection.js";
import core from 'gatecore';

let deviceName = "New Device";

const setDeviceName = (name) => {
    if (!state.isCreated) {
        deviceName = name;
    } else {
        logger.logWarning('Attempting to change device name after connection created');
    }
}

const createConnection = () => {
    if (state.isCreated) {
        logger.logWarning("Attempting to create already created connection");
        return;
    }
    state.isCreated = true;
    const manifest = {
        deviceName,
        ...core.ValueFactory.createValuesManifest()
    }
    core.ValueFactory.initializeAll();
    state.manifest = manifest;
    return startConnection();
}

const createValue = (direction, valueType, name) => {
    if (!state.isCreated) {
        return core.ValueFactory.createValue(direction, valueType, name);
    }
}

const state = {
    isCreated: false
};

export default {
    setDeviceName,
    createConnection,
    createValue,
    state
}