import {
    Connection,
    ConnectionState,
    DefaultConnection,
    Directions, GateNumber,
    GateValue,
    GateValueFactory,
    Keywords,
    Manifest,
    Registry,
    SystemIds,
    ValueMessage,
    ValueTypes
} from "gate-core";
import config from "../../config.js";
import ValueFactory from "../values/ValueFactory.js";
import {DeviceState} from "../device/DeviceState.js";
import {initLocalServer} from "../connection/LocalServer.js";
import fs from 'fs';

interface Device {
    isStarted: boolean,
    manifest: Manifest | undefined,
    values: Registry<GateValue<any>>,
    deviceState: DeviceState,
    connection: Connection
}

let deviceName = "New Device";

const setName = (name: string) => {
    if (!device.isStarted) {
        deviceName = name;
    } else {
        console.log('WARNING: Attempting to change device name after device started');
    }
}

const start = (): DeviceState => {
    if (device.isStarted) {
        console.log("WARNING: Attempting to start already running device");
    } else {
        if (config.usePing) {
            const ping = GateValueFactory.fromManifest({
                id: SystemIds.ping,
                type: ValueTypes.integer,
                direction: Directions.output,
                valueName: 'Ping'
            }) as GateNumber;
            device.connection.onPingChange = (value) => {
                if (ping.subscribed) {
                    ping.setValue(value);
                    device.connection.sendGateValue(ping);
                }
            }
            device.values.add(ping, ping.id);
        }
        device.isStarted = true;
        device.manifest = {
            id: getDeviceId(),
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
    device.connection.functionalHandler.addCommandListener(Keywords.subscribe, (ids) => {
        handleSubscriptionChange(true, ids);
    });
    device.connection.functionalHandler.addCommandListener(Keywords.unsubscribe, (ids) => {
        handleSubscriptionChange(false, ids);
    });
    initLocalServer();
}

const onValueMessage = (changes: ValueMessage) => {
    changes.forEach((change) => {
        const targetValue = device.values.getByKey(change[0]);
        if (targetValue !== undefined) {
            if (targetValue.direction === Directions.output) {
                console.log('WARNING: Attempting to remotely change output value: ' + targetValue.valueName)
            } else {
                targetValue.fromRemote(change[1]);
            }
        } else {
            console.log('WARNING: Unknown value with id: ' + change[0]);
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
                console.log(`WARNING: Attempting to ${subscribed ? 'subscribe' : 'unsubscribe'} unknown value with id: ${id}`);
            }
        });
    }
}

const onStateChange = (state: ConnectionState) => {
    device.deviceState.state = state;
    if (device.deviceState.onStateChange) {
        device.deviceState.onStateChange(state);
    }
    if (state === ConnectionState.closed) {
        device.values.getValues().forEach((value) => value.setSubscribed(false));
    }
};

const getDeviceId = () => {
    try {
        const storedId = fs.readFileSync('id.json');
        return JSON.parse(storedId.toString()).id;
    } catch (err) {
        return undefined;
    }
}

export const device: Device = {
    isStarted: false,
    manifest: undefined,
    values: new Registry<GateValue<any>>(),
    deviceState: {
        state: ConnectionState.closed,
        onStateChange: undefined
    },
    connection: new DefaultConnection(true, config)
};

export default {
    setName,
    start,
    config,
    ValueFactory
}