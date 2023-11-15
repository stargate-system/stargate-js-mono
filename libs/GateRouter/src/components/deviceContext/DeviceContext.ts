import {DeviceConnector} from "./api/DeviceConnector";
import {EventName} from "../../constants/EventName";
import {ConnectionState, Registry, ValueMessage} from "gate-core";
import Router from "../../api/Router";
import Markers from "../../constants/Markers";
import ControllerContext from "../controllerContext/ControllerContext";
import {Device} from "./api/Device";

const deviceRegistry = new Registry<Device>();

const addDevice = async (deviceConnector: DeviceConnector) => {
    if (!deviceConnector.manifest) {
        throw new Error('On adding device - no manifest');
    }
    if (deviceConnector.manifest.id === undefined) {
        deviceConnector.manifest = await Router.systemRepository.createDevice(deviceConnector.manifest);
    }
    deviceConnector.id = deviceConnector.manifest.id;
    const device: Device = deviceConnector as Device;
    deviceRegistry.add(device, device.id);
    if (device.manifest.values) {
        device.manifest.values.forEach((value) => {
            value.id = appendSource(device.id, value.id);
        });
    }
    ControllerContext.handleDeviceEvent(EventName.connected, device);
    device.onStateChange = (state) => {
        if (state === ConnectionState.closed) {
            deviceRegistry.remove(device.id);
            ControllerContext.handleDeviceEvent(EventName.disconnected, device);
        }
    };
    device.onValueMessage = (valueMessage: ValueMessage) => routeDeviceMessage(valueMessage, device);
}

const appendSource = (source: string, target: string) => {
    return source + Markers.addressSeparator + target;
}

const extractTarget = (address: string) => {
    const separatorIndex = address.indexOf(Markers.addressSeparator);
    return [address.substring(0, separatorIndex), address.substring(separatorIndex + 1)];
}

const routeDeviceMessage = (valueMessage: ValueMessage, source: Device) => {
    valueMessage.forEach((entry) => {
        entry[0] = appendSource(source.id, entry[0]);
    });
    ControllerContext.handleValueMessage(valueMessage);
}

const handleValueMessage = (valueMessage: ValueMessage) => {
    valueMessage.forEach((message) => {
        const [deviceId, valueId] = extractTarget(message[0]);
        const device = deviceRegistry.getByKey(deviceId);
        device?.sendValue([valueId, message[1]]);
    });
}

const getActiveDeviceIds = (): string[] => {
    return deviceRegistry.getValues().map((device) => device.id);
}

const DeviceContext = {
    deviceRegistry,
    addDevice,
    handleValueMessage,
    getActiveDeviceIds
}

export default DeviceContext;
