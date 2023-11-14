import {Manifest} from "gate-core";
import registries from "../model/registries";
import GateValueService from "./GateValueService";
import {DeviceActiveState} from "../model/DeviceActiveState";

const handleDeviceConnected = (manifest: Manifest) => {
    // @ts-ignore
    const deviceState = registries.deviceStateRegistry.getByKey(manifest.id);
    if (deviceState) {
        deviceState.setIsActive(true);
    } else {
        addDevice(manifest, true);
    }
}

const handleDeviceDisconnected = (id: string) => {
    const deviceState = registries.deviceStateRegistry.getByKey(id);
    if (deviceState) {
        deviceState.setIsActive(false)
    }
}

const addDevice = (device: Manifest, isActive: boolean) => {
    if (!registries.deviceStateRegistry.getByKey(device.id)) {
        registries.deviceStateRegistry.add(new DeviceActiveState(isActive), device.id);
        const values = device.values;
        if (values) {
            values.forEach((valueManifest) => {
                GateValueService.registerValue(valueManifest);
            });
        }
    }
}

const DeviceService = {
    handleDeviceConnected,
    handleDeviceDisconnected,
    addDevice
}

export default DeviceService;
