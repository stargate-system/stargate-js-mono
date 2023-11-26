import {SystemRepository} from "gate-router";
import {Manifest} from "gate-core";
import {ValidManifest} from "gate-router";

let nextId = 1;
let devices: ValidManifest[] = [];

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
    },
    updateDevice: async (manifest: ValidManifest) => manifest
}

const getMockSystemRepository = () => {
    nextId = 1;
    devices = [];
    return MockSystemRepository;
}

export default getMockSystemRepository;
