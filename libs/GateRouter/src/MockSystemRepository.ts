import {SystemRepository} from "./api/SystemRepository";
import {DeviceConnector} from "./context/deviceContext/api/DeviceConnector";

let nextId = 1;

const MockSystemRepository: SystemRepository = {
    getSystemImage: async () => {
        return {devices: []}
    },
    createDevice: async (device: DeviceConnector) => {
        device.id = nextId.toString();
        // @ts-ignore
        device.manifest?.id = device.id;
        nextId++;
    }
}

export default MockSystemRepository;
