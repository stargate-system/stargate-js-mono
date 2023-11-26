import {SystemRepository} from "gate-router";
import {Manifest} from "gate-core";
import {ValidManifest} from "gate-router";

let nextId = 1;
let devices: ValidManifest[] = [];

const BasicSystemRepository: SystemRepository = {
    getSystemImage: async () => {
        return {devices: [...devices]}
    },
    createDevice: async (manifest: Manifest) => {
        manifest.id = nextId.toString();
        nextId++;
        const validManifest = manifest as ValidManifest;
        devices.push(validManifest);
        return validManifest;
    }
}

const getBasicRepository = () => {
    nextId = 1;
    devices = [];
    return BasicSystemRepository;
}

export default getBasicRepository;
