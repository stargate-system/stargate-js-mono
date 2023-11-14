import {SystemRepository} from "./api/SystemRepository";
import {Manifest} from "gate-core";
import {ValidManifest} from "./context/deviceContext/api/ValidManifest";

let nextId = 1;
const devices: ValidManifest[] = [];

const MockSystemRepository: SystemRepository = {
    getSystemImage: async () => {
        return {devices}
    },
    createDevice: async (manifest: Manifest) => {
        manifest.id = nextId.toString();
        nextId++;
        const validManifest = manifest as ValidManifest;
        devices.push(validManifest);
        return validManifest;
    }
}

export default MockSystemRepository;
