import {ConnectionState, Manifest, Registry, ValueMessage} from "gate-core";
import {DeviceConnector} from "./DeviceConnector.js";
import {ControllerConnector} from "./ControllerConnector.js";
import {EventName} from "./EventName.js";
import MockSystemRepository from "../MockSystemRepository.js";
import {SystemRepository} from "./SystemRepository.js";

const deviceRegistry = new Registry<ValidDevice>();
const controllerRegistry = new Registry<ControllerConnector>();
const ADDRESS_SEPARATOR = ':';

interface ValidDevice extends DeviceConnector {
    id: string,
    manifest: Manifest
}

const addDevice = async (device: DeviceConnector) => {
    if (!device.manifest) {
        throw new Error('On adding device - no manifest');
    }
    if (device.id === undefined) {
        await Router.systemRepository.createDevice(device);
    }
    const validDevice: ValidDevice = device as ValidDevice;
    deviceRegistry.add(validDevice, validDevice.id);
    if (validDevice.manifest.values) {
        validDevice.manifest.values.forEach((value) => {
            value.id = appendSource(validDevice.id, value.id);
        });
    }
    controllerRegistry.getValues()
        .forEach((controller) => controller.handleDeviceEvent(EventName.connected, validDevice));
    validDevice.onStateChange = (state) => {
        if (state === ConnectionState.closed) {
            deviceRegistry.remove(validDevice.id);
            deviceDisconnected(validDevice);
        }
    };
    validDevice.onValueMessage = (valueMessage: ValueMessage) => routeDeviceMessage(valueMessage, validDevice);
}

const addController = async (controller: ControllerConnector) => {
    if (controller.id === undefined) {
        controller.id = controllerRegistry.add(controller);
        controller.onDisconnect = () => controllerDisconnected(controller);
        controller.onValueMessage = routeControllerMessage;
        const systemImage = await Router.systemRepository.getSystemImage();
        // @ts-ignore
        controller.handleJoined(systemImage, deviceRegistry.getValues().map((device) => device.id));
        deviceRegistry.getValues().forEach((device) => {
            controller.handleDeviceEvent(EventName.connected, device);
        });
    }
}

const controllerDisconnected = (controller: ControllerConnector) => {
    if (controller.id) {
        controllerRegistry.remove(controller.id);
    }
}

const routeControllerMessage = (valueMessage: ValueMessage) => {

}

const appendSource = (source: string, target: string) => {
    return source + ADDRESS_SEPARATOR + target;
}

const routeDeviceMessage = (valueMessage: ValueMessage, source: ValidDevice) => {
    valueMessage.forEach((entry) => {
        entry[0] = appendSource(source.id, entry[0]);
    });
    controllerRegistry.getValues().forEach((controller) => {
        controller.handleValueMessage(valueMessage);
    })
}

const deviceDisconnected = (device: ValidDevice) => {
    controllerRegistry.getValues()
        .forEach((controller) => controller.handleDeviceEvent(EventName.disconnected, device));
};

const Router = {
    addDevice,
    addController,
    systemRepository: MockSystemRepository as SystemRepository
}

export default Router;
