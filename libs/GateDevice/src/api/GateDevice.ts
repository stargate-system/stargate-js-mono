import logger from "../DeviceLogger.js";
import {GateValue, ConnectionState, Directions, Manifest, Registry, ValueMessage} from "gate-core";
import config from "../../config.js";
import ValueFactory from "../ValueFactory.js";
import {DeviceState} from "./DeviceState.js";
import {initServerless} from "../connection/Serverless.js";
import {ConnectionType} from "./ConnectionType.js";

interface Device {
    isStarted: boolean,
    manifest: Manifest | undefined,
    values: Registry<GateValue<any>>,
    sendValue: (gateValue: GateValue<any>) => void,
    onValueMessage: (changes: ValueMessage) => void,
    onStateChange: (state: ConnectionState) => void,
    deviceState: DeviceState
}

let deviceName = "New Device";

const setDeviceName = (name: string) => {
    if (!device.isStarted) {
        deviceName = name;
    } else {
        logger.warning('Attempting to change device name after device started');
    }
}

const startDevice = (): DeviceState => {
    if (device.isStarted) {
        logger.warning("Attempting to start already running device");
    } else {
        device.isStarted = true;
        device.manifest = {
            deviceName,
            values: [
                ...device.values.getValues().map((value: GateValue<any>) => value.toManifest())
            ]
        }
        startConnection();
    }
    return device.deviceState;
}

const startConnection = () => {
    switch (config.connectionType) {
        case ConnectionType.serverless:
            initServerless();
            break;
        case ConnectionType.localServer:
            // TODO
            break;
        default:
            throw new Error('On starting connection: unknown connection type ' + config.connectionType);
    }
}

const onValueMessage = (changes: ValueMessage) => {
    changes.forEach((change) => {
        const targetValue = device.values.getByKey(change[0]);
        if (targetValue !== undefined) {
            if (targetValue.direction === Directions.output) {
                logger.warning('Attempting to remotely change output value: ' + targetValue.valueName)
            } else {
                targetValue.fromRemote(change[1]);
            }
        } else {
            logger.warning('Unknown value with id: ' + change[0]);
        }
    })
}

const onStateChange = (state: ConnectionState) => {
    device.deviceState.state = state;
    if (device.deviceState.onStateChange) {
        device.deviceState.onStateChange(state);
    }
}

export const device: Device = {
    isStarted: false,
    manifest: undefined,
    values: new Registry<GateValue<any>>(),
    sendValue: () => {},
    onValueMessage,
    onStateChange,
    deviceState: {
        state: ConnectionState.closed,
        onStateChange: undefined
    }
};

export default {
    setDeviceName,
    startDevice,
    logger,
    config,
    ValueFactory
}