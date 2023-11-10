import {SystemImage} from "gate-router";
import DeviceService from "./DeviceService";

const initialize = (systemImage: SystemImage, activeDevices: string[]) => {
    systemImage.devices.forEach((device) => {
        const isActive = !!activeDevices.filter((id) => id === device.id).length;
        DeviceService.addDevice(device, isActive);
    });
}

const SystemImageService = {
    initialize
}

export default SystemImageService;
