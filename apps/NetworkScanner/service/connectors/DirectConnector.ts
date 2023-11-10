import {ValueMessage} from "gate-core";
import {ControllerConnector, DeviceConnector, EventName, Router, SystemImage} from "gate-router";
import {SystemConnector} from "../../../../components/SystemDashboard/api/SystemConnector";

const handleValueMessage = () => {};

const systemConnector: SystemConnector = {
    onDeviceEvent: () => {},
    onValueMessage: () => {},
    handleValueMessage,
    onStateChange: () => {},
    onJoinEvent: () => {},
    joinSystem: () => Router.addController(DirectConnector.routerConnector)
}

const handleDeviceEvent = (event: EventName, device: DeviceConnector) => {
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
    handleValueMessage: (valueMessage: ValueMessage) => {
        if (systemConnector.onValueMessage) {
            systemConnector.onValueMessage(valueMessage);
        }
    },
    handleDeviceEvent,
    onValueMessage: () => {},
    onDisconnect: () => {},
    handleJoined: (systemImage: SystemImage, connectedDevices: Array<string>) => systemConnector.onJoinEvent(systemImage, connectedDevices)
};

const DirectConnector = {
    systemConnector,
    routerConnector
}

export default DirectConnector