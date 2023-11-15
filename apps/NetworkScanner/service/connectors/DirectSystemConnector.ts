import {GateValue, ValueMessage} from "gate-core";
import {ControllerConnector, Device, EventName, Router, SystemImage} from "gate-router";
import {SystemConnector} from "../../../../components/SystemDashboard/api/SystemConnector";

const sendValue = (gateValue: GateValue<any>) => {
    routerConnector.onValueMessage([[gateValue.id, gateValue.toString()]]);
};

const systemConnector: SystemConnector = {
    onDeviceEvent: () => {},
    onValueMessage: () => {},
    sendValue,
    onStateChange: () => {},
    onJoinEvent: () => {},
    joinSystem: () => {
        Router.addController(DirectSystemConnector.routerConnector);
    }
}

const sendDeviceEvent = (event: EventName, device: Device) => {
    let data;
    switch (event) {
        case EventName.connected:
            data = device.manifest;
            break;
        case EventName.disconnected:
            data = device.id;
            break;
    }
    if (systemConnector.onDeviceEvent && data !== undefined) {
        systemConnector.onDeviceEvent(event, data);
    }
};

const routerConnector: ControllerConnector = {
    id: undefined,
    sendValueMessage: (valueMessage: ValueMessage) => {
        if (systemConnector.onValueMessage) {
            systemConnector.onValueMessage(valueMessage);
        }
    },
    sendDeviceEvent,
    onValueMessage: () => {},
    onDisconnect: () => {},
    sendJoinData: (systemImage: SystemImage, connectedDevices: Array<string>) => systemConnector.onJoinEvent(systemImage, connectedDevices)
};

const DirectSystemConnector = {
    systemConnector,
    routerConnector
}

export default DirectSystemConnector