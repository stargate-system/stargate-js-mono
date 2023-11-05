import logger from "./logger/logger.js";
import {startConnection} from "./connection/ServerConnection.js";
import {Registry} from "gate-core";
import {Connection, GateValue, ValueOutputBuffer} from "gate-core";
import config from "../config.js";

interface DeviceState {
    isStarted: boolean,
    manifest: Object | undefined,
    connection: Connection,
    values: Registry<GateValue<any>>,
    outputBuffer: ValueOutputBuffer
}

let deviceName = "New Device";

const setDeviceName = (name: string) => {
    if (!state.isStarted) {
        deviceName = name;
    } else {
        logger.logWarning('Attempting to change device name after device started');
    }
}

const startDevice = (): Connection | undefined => {
    if (state.isStarted) {
        logger.logWarning("Attempting to start already running device");
        return;
    }
    state.isStarted = true;
    state.manifest = {
        deviceName,
        values: [
            ...state.values.getValues().map((value: GateValue<any>) => value.toManifest())
        ]
    }
    startConnection();
    return state.connection;
}

export const state: DeviceState = {
    isStarted: false,
    manifest: undefined,
    connection: new Connection(),
    values: new Registry<GateValue<any>>(),
    outputBuffer: new ValueOutputBuffer(config)
};

export default {
    setDeviceName,
    startDevice
}