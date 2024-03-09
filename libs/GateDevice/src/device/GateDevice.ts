import {
    Connection,
    ConnectionState,
    DefaultConnection,
    Directions,
    GateValue,
    Keywords,
    Manifest,
    Registry,
    ServerStorage,
    ValueMessage
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
let info: string | undefined;

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

const setInfo = (content: string) => {
    if (!device.isStarted) {
        info = content;
    } else {
        console.log('WARNING: Attempting to change device info after device started');
    }
}

const start = () => {
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
        if (info) {
            device.manifest.info = info;
        }
        startConnection();
    }
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
    device.deviceState.current = state;
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

const isReady = () => {
    return device.deviceState.current === ConnectionState.ready;
}

export const device: Device = {
    isStarted: false,
    isStopped: false,
    manifest: undefined,
    values: new Registry<GateValue<any>>(),
    deviceState: {
        current: ConnectionState.closed,
        onStateChange: undefined
    },
    connection: new DefaultConnection(false, config)
};

export default {
    setName,
    setGroup,
    setInfo,
    start,
    stop,
    config,
    ValueFactory,
    ServerStorage: new ServerStorage(device.connection),
    state: device.deviceState,
    isReady
}