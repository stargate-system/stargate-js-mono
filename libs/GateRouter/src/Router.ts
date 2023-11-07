import {Registry, ValueMessage} from "gate-core";
import {DeviceConnector} from "./api/DeviceConnector";
import {ControllerConnector} from "./api/ControllerConnector";
import {EventName} from "./api/EventName";

const deviceRegistry = new Registry<DeviceConnector>();
const controllerRegistry = new Registry<ControllerConnector>();
const ADDRESS_SEPARATOR = ':';

const addDevice = (device: DeviceConnector) => {
    deviceRegistry.add(device, device.id);
    if (device.manifest?.values) {
        device.manifest.values.forEach((value) => {
            value.id = appendSource(device.id, value.id);
        });
    }
    controllerRegistry.getValues()
        .forEach((controller) => controller.handleDeviceEvent(EventName.connected, device));
    device.onDisconnect = () => {
        deviceRegistry.remove(device.id);
        deviceDisconnected(device);
    };
    device.onValueMessage = (valueMessage: ValueMessage) => routeDeviceMessage(valueMessage, device);
}

const addController = (controller: ControllerConnector) => {
    controllerRegistry.add(controller, controller.id);
    controller.onDisconnect = () => controllerDisconnected(controller);
    controller.onValueMessage = routeControllerMessage;
}

const controllerDisconnected = (controller: ControllerConnector) => {

}

const routeControllerMessage = (valueMessage: ValueMessage) => {

}

const appendSource = (source: string, target: string) => {
    return source + ADDRESS_SEPARATOR + target;
}

const routeDeviceMessage = (valueMessage: ValueMessage, source: DeviceConnector) => {
    valueMessage.forEach((entry) => {
        entry[0] = appendSource(source.id, entry[0]);
    });
    controllerRegistry.getValues().forEach((controller) => {
        controller.handleValueMessage(valueMessage);
    })
}

const deviceDisconnected = (device: DeviceConnector) => {
    controllerRegistry.getValues()
        .forEach((controller) => controller.handleDeviceEvent(EventName.disconnected, device));
};

const Router = {
    addDevice,
    addController
}

export default Router;
