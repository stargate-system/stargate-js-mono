import {Manifest, ValidManifest} from "gate-core";
import crypto from 'crypto';
import fs from 'fs';
import {SystemImage} from "gate-core";
import {SystemRepository} from "./SystemRepository";

let systemImage: SystemImage;
let saveTimeout: NodeJS.Timeout | undefined;

const BasicSystemRepository: SystemRepository = {
    getSystemImage: async () => {
        return systemImage;
    },
    createDevice: async (manifest: Manifest) => {
        manifest.id = crypto.randomUUID();
        const validManifest = manifest as ValidManifest;
        systemImage.devices.push(validManifest);
        saveRepository();
        return validManifest;
    },
    updateDevice: async (manifest: ValidManifest)=> {
        const index = systemImage.devices.findIndex((storedManifest) => storedManifest.id === manifest.id);
        if (index !== -1) {
            manifest.deviceName = systemImage.devices[index].deviceName;
            systemImage.devices[index] = manifest;
        } else {
            systemImage.devices.push(manifest);
        }
        saveRepository();
        return manifest
    },
    removeDevice: (id: string) => {
        systemImage.devices = systemImage.devices.filter((device) => device.id !== id);
        saveRepository();
    },
    renameDevice: (id: string, newName: string) => {
        const device = systemImage.devices.find((manifest) => manifest.id === id);
        if (device) {
            device.deviceName = newName;
        }
        saveRepository();
    }
}

const getBasicRepository = () => {
    if (!systemImage) {
        try {
            const systemImageFile = fs.readFileSync('systemImage.json');
            systemImage = JSON.parse(systemImageFile.toString()) as SystemImage;
        } catch (err) {
            systemImage = {devices: []};
        }
    }
    return BasicSystemRepository;
}

const saveRepository = () => {
    if (saveTimeout === undefined) {
        saveTimeout = setTimeout(() => {
            saveTimeout = undefined;
            fs.writeFile('systemImage.json', JSON.stringify(systemImage), (err) => {
                if (err) {
                    console.log('On saving repository', err);
                }
            });
        }, 1000);
    }
}

export default getBasicRepository;
