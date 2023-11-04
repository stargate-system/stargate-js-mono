import logger from "./logger/logger.js";
import {Connection, startConnection} from "./connection/Connection.js";
import {Registry} from "gate-core/dist/src/components/Registry";
import {GateValue, OutputBuffer} from "gate-core";

interface DeviceState {
    isStarted: boolean,
    manifest: Object | undefined,
    connection: Connection | undefined,
    values: Registry<GateValue<any>>,
    outputBuffer: OutputBuffer
}

let deviceName = "New Device";

const setDeviceName = (name: string) => {
    if (!state.isStarted) {
        deviceName = name;
    } else {
        logger.logWarning('Attempting to change device name after device started');
    }
}

const startDevice = (): DeviceState | undefined => {
    if (state.isStarted) {
        logger.logWarning("Attempting to start already running device");
        return;
    }
    state.isStarted = true;
    state.manifest = {
        deviceName,
        values: [
            ...state.values.getValues().map((value) => value.toManifest())
        ]
    }
    state.connection = startConnection();
    return state;
}

const sendFunction = (message: string) => {
    if (state.connection?.socketHandler?.sendMessage) {
        state.connection.socketHandler.sendMessage(message);
    }
}

export const state: DeviceState = {
    isStarted: false,
    manifest: undefined,
    connection: undefined,
    values: new Registry<GateValue<any>>(),
    outputBuffer: new OutputBuffer(sendFunction)
};

export default {
    setDeviceName,
    startDevice
}