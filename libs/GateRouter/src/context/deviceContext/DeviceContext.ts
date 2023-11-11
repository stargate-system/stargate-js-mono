import {DeviceConnector} from "./api/DeviceConnector";
import {EventName} from "../../api/EventName";
import {ConnectionState, Manifest, Registry, ValueMessage} from "gate-core";
import Router from "../../api/Router";
import Markers from "../../Markers";
import ControllerContext from "../controllerContext/ControllerContext";

const deviceRegistry = new Registry<ValidDevice>();

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
    ControllerContext.controllerRegistry.getValues()
        .forEach((controller) => controller.handleDeviceEvent(EventName.connected, validDevice));
    validDevice.onStateChange = (state) => {
        if (state === ConnectionState.closed) {
            deviceRegistry.remove(validDevice.id);
            deviceDisconnected(validDevice);
        }
    };
    validDevice.onValueMessage = (valueMessage: ValueMessage) => routeDeviceMessage(valueMessage, validDevice);
}

const deviceDisconnected = (device: ValidDevice) => {
    ControllerContext.controllerRegistry.getValues()
        .forEach((controller) => controller.handleDeviceEvent(EventName.disconnected, device));
};

const appendSource = (source: string, target: string) => {
    return source + Markers.addressSeparator + target;
}

const routeDeviceMessage = (valueMessage: ValueMessage, source: ValidDevice) => {
    valueMessage.forEach((entry) => {
        entry[0] = appendSource(source.id, entry[0]);
    });
    ControllerContext.controllerRegistry.getValues().forEach((controller) => {
        controller.handleValueMessage(valueMessage);
    })
}

const handleDeviceMessage = (valueMessage: ValueMessage) => {

}

const DeviceContext = {
    deviceRegistry,
    addDevice,
    handleDeviceMessage
}

export default DeviceContext;
