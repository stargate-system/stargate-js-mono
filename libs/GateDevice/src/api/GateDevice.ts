import logger from "../DeviceLogger.js";
import {startConnection} from "../connection/ServerConnection.js";
import {Manifest, Registry} from "gate-core";
import {Connection, AbstractValue, ValueOutputBuffer} from "gate-core";
import config from "../../config.js";
import ValueFactory from "../ValueFactory.js";

interface DeviceState {
    isStarted: boolean,
    manifest: Manifest | undefined,
    connection: Connection,
    values: Registry<AbstractValue<any>>,
    outputBuffer: ValueOutputBuffer
}

let deviceName = "New Device";

const setDeviceName = (name: string) => {
    if (!state.isStarted) {
        deviceName = name;
    } else {
        logger.warning('Attempting to change device name after device started');
    }
}

const startDevice = (): Connection | undefined => {
    if (state.isStarted) {
        logger.warning("Attempting to start already running device");
        return;
    }
    state.isStarted = true;
    state.manifest = {
        deviceName,
        values: [
            ...state.values.getValues().map((value: AbstractValue<any>) => value.toManifest())
        ]
    }
    startConnection();
    return state.connection;
}

export const state: DeviceState = {
    isStarted: false,
    manifest: undefined,
    connection: new Connection(),
    values: new Registry<AbstractValue<any>>(),
    outputBuffer: new ValueOutputBuffer(config)
};

export default {
    setDeviceName,
    startDevice,
    logger,
    config,
    ValueFactory
}