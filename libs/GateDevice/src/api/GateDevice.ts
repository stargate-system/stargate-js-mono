import logger from "../components/DeviceLogger.js";
import {
    Connection,
    ConnectionState,
    DefaultConnection,
    Directions,
    GateValue,
    Keywords,
    Manifest,
    Registry,
    ValueMessage
} from "gate-core";
import config from "./config.js";
import ValueFactory from "../components/values/ValueFactory.js";
import {DeviceState} from "../interfaces/DeviceState.js";
import {initServerless} from "../components/connection/Serverless.js";
import {ConnectionType} from "../constants/ConnectionType.js";

interface Device {
    isStarted: boolean,
    manifest: Manifest | undefined,
    values: Registry<GateValue<any>>,
    deviceState: DeviceState,
    connection: Connection
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
    device.connection.onValueMessage = onValueMessage;
    device.connection.addStateChangeListener(onStateChange);
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

const handleSubscriptionChange = (subscribed: boolean, ids?: string[]) => {
    if (ids) {
        ids.forEach((id) => {
            const gateValue = device.values.getByKey(id);
            if (gateValue) {
                gateValue.setSubscribed(subscribed);
            } else {
                logger.warning(`Attempting to ${subscribed ? 'subscribe' : 'unsubscribe'} unknown value with id: ${id}`);
            }
        });
    }
}

const onStateChange = (state: ConnectionState) => {
    device.deviceState.state = state;
    if (device.deviceState.onStateChange) {
        device.deviceState.onStateChange(state);
    }
    if (state === ConnectionState.connected) {
        device.connection.functionalHandler.addCommandListener(Keywords.subscribe, (ids) => {
            handleSubscriptionChange(true, ids);
        });
        device.connection.functionalHandler.addCommandListener(Keywords.unsubscribe, (ids) => {
            handleSubscriptionChange(false, ids);
        });
    } else if (state === ConnectionState.closed) {
        device.values.getValues().forEach((value) => value.setSubscribed(false));
    }
};

export const device: Device = {
    isStarted: false,
    manifest: undefined,
    values: new Registry<GateValue<any>>(),
    deviceState: {
        state: ConnectionState.closed,
        onStateChange: undefined
    },
    connection: new DefaultConnection(config)
};

export default {
    setDeviceName,
    startDevice,
    logger,
    config,
    ValueFactory
}