import {SystemConnector, ValueMessage} from "gate-core";
import {ControllerConnector, DeviceConnector, EventName} from "gate-router";

const handleValueMessage = () => {};

const systemConnector: SystemConnector = {
    onDeviceEvent: () => {},
    onValueMessage: () => {},
    handleValueMessage,
    onStateChange: () => {}
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
    systemConnector.onDeviceEvent(event, data);
};

const routerConnector: ControllerConnector = {
    handleValueMessage: (valueMessage: ValueMessage) => systemConnector.onValueMessage(valueMessage),
    handleDeviceEvent,
    onValueMessage: () => {},
    onDisconnect: () => {}
};

const DirectConnector = {
    systemConnector,
    routerConnector
}

export default DirectConnector