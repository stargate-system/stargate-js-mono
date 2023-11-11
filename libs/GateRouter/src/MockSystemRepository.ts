import {SystemRepository} from "./api/SystemRepository";
import {Manifest} from "gate-core";
import {ValidManifest} from "./context/deviceContext/api/ValidManifest";

let nextId = 1;

const MockSystemRepository: SystemRepository = {
    getSystemImage: async () => {
        return {devices: []}
    },
    createDevice: async (manifest: Manifest) => {
        manifest.id = nextId.toString();
        nextId++;
        return manifest as ValidManifest;
    }
}

export default MockSystemRepository;
