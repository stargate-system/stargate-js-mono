import {
    Connection,
    ConnectionState,
    DefaultConnection,
    Directions,
    GateNumber,
    GateValue,
    GateValueFactory,
    Keywords,
    Manifest,
    Registry,
    SystemIds,
    ValueMessage,
    ValueTypes,
    ServerStorage
} from "gate-core";
import config from "../../config.js";
import ValueFactory from "../values/ValueFactory.js";
import {DeviceState} from "./DeviceState.js";
import {initLocalServer} from "../connection/LocalServer.js";
import fs from 'fs';

interface Device {
    isStarted: boolean,
    isStopped: boolean,
    manifest: Manifest | undefined,
    values: Registry<GateValue<any>>,
    deviceState: DeviceState,
    connection: Connection
}

let deviceName = "New Device";
let groupName: string | undefined;

const setName = (name: string) => {
    if (!device.isStarted) {
        deviceName = name;
    } else {
        console.log('WARNING: Attempting to change device name after device started');
    }
}

const setGroup = (name: string) => {
    if (!device.isStarted) {
        groupName = name;
    } else {
        console.log('WARNING: Attempting to change device group after device started');
    }
}

const start = (): DeviceState => {
    if (device.isStarted) {
        console.log("WARNING: Attempting to start already running device");
    } else if (device.connection.state !== ConnectionState.closed) {
        const listenerKey = device.connection.addStateChangeListener(() => {
            if (device.connection.state === ConnectionState.closed) {
                device.connection.removeStateChangeListener(listenerKey);
                start();
            }
        });
    } else {
        if (config.usePing && !device.values.getValues().find((value) => value.id === SystemIds.ping)) {
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
        device.manifest = {
            id: getDeviceId(),
            deviceName,
            values: [
                ...device.values.getValues().map((value: GateValue<any>) => value.toManifest())
            ]
        }
        if (groupName) {
            device.manifest.group = groupName;
        }
        startConnection();
    }
    return device.deviceState;
}

const stop = () => {
    device.isStarted = false;
    device.isStopped = true;
    device.connection.close();
}

const startConnection = () => {
    if (!device.isStopped) {
        device.connection.onValueMessage = onValueMessage;
        device.connection.addStateChangeListener(onStateChange);
        device.connection.functionalHandler.addCommandListener(Keywords.subscribe, (ids) => {
            handleSubscriptionChange(true, ids);
        });
        device.connection.functionalHandler.addCommandListener(Keywords.unsubscribe, (ids) => {
            handleSubscriptionChange(false, ids);
        });
    }
    device.isStarted = true;
    device.isStopped = false;
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

const usePing = () => {
    config.usePing = true;
}

export const device: Device = {
    isStarted: false,
    isStopped: false,
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
    setGroup,
    usePing,
    start,
    stop,
    config,
    ValueFactory,
    ServerStorage: new ServerStorage(device.connection)
}