import {ConnectionState, GateValue, ValueMessage} from "gate-core";
import {ControllerConnector, Device, EventName, Router, SubscriptionBuffer, SystemImage} from "gate-router";
import {SystemConnector} from "gate-viewmodel";

const sendValue = (gateValue: GateValue<any>) => {
    routerConnector.onValueMessage([[gateValue.id, gateValue.toString()]]);
};

const subscribe = (id: string) => {
    subscriptionBuffer.subscribe(id);
}

const unsubscribe = (id: string) => {
    subscriptionBuffer.unsubscribe(id);
}

const subscriptionBuffer = new SubscriptionBuffer(
    (subscribed) => routerConnector.onSubscribed(subscribed),
    (unsubscribed) => routerConnector.onUnsubscribed(unsubscribed)
);

const systemConnector: SystemConnector = {
    state: ConnectionState.closed,
    onDeviceEvent: () => {},
    onValueMessage: () => {},
    sendValue,
    subscribe,
    unsubscribe,
    addStateChangeListener: () => {},
    onJoinEvent: () => {},
    joinSystem: () => {
        Router.addController(DirectSystemConnector.routerConnector);
    }
}

const sendDeviceEvent = (event: EventName, device: Device) => {
    let data;
    switch (event) {
        case EventName.deviceConnected:
            data = device.manifest;
            break;
        case EventName.deviceDisconnected:
            data = device.id;
            break;
    }
    if (systemConnector.onDeviceEvent && data !== undefined) {
        systemConnector.onDeviceEvent(event, data);
    }
};

const routerConnector: ControllerConnector = {
    id: '',
    sendValueMessage: (valueMessage: ValueMessage) => {
        if (systemConnector.onValueMessage) {
            systemConnector.onValueMessage(valueMessage);
        }
    },
    sendDeviceEvent,
    onValueMessage: () => {},
    onDisconnect: () => {},
    onSubscribed: () => {},
    onUnsubscribed: () => {},
    sendJoinData: (systemImage: SystemImage, connectedDevices: Array<string>) => systemConnector.onJoinEvent(systemImage, connectedDevices)
};

const DirectSystemConnector = {
    systemConnector,
    routerConnector
}

export default DirectSystemConnector