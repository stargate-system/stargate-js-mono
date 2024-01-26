import {Manifest, ValidManifest} from "gate-core";
import crypto from 'crypto';
import fs from 'fs';
import {SystemImage} from "gate-core";
import {SystemRepository} from "./SystemRepository";

let systemImage: SystemImage;
let saveTimeout: NodeJS.Timeout | undefined;

const generateId = (): string => {
    if (systemImage.devices.length === 0) {
        return '0';
    }
    const ids = systemImage.devices
        .map((device) => Number.parseInt(device.id))
        .sort((a, b) => a - b);
    if (ids[0] > 0) {
        return '0';
    }
    let previousId: number | undefined = undefined;
    for(const id of ids) {
        if (previousId === undefined) {
            previousId = id;
        } else {
            if (id - previousId > 1) {
                break;
            } else {
                previousId = id;
            }
        }
    }
    // @ts-ignore
    return (previousId + 1).toString();
}

const BasicSystemRepository: SystemRepository = {
    getSystemImage: async () => {
        return systemImage;
    },
    createDevice: async (manifest: Manifest) => {
        const validManifest = manifest as ValidManifest;
        validManifest.uuid = crypto.randomUUID();
        validManifest.id = generateId();
        systemImage.devices.push(validManifest);
        saveRepository();
        return validManifest;
    },
    updateDevice: async (manifest: ValidManifest)=> {
        const index = systemImage.devices.findIndex((storedManifest) => storedManifest.uuid === manifest.uuid);
        if (index !== -1) {
            manifest.id = systemImage.devices[index].id;
            manifest.deviceName = systemImage.devices[index].deviceName;
            manifest.group = systemImage.devices[index].group;
            systemImage.devices[index] = manifest;
        } else {
            manifest.id = generateId();
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
    },
    createPipe: (pipe: [string, string]) => {
        if(!systemImage.pipes.find((storedPipe) => storedPipe[0] === pipe[0] && storedPipe[1] === pipe[1])) {
            systemImage.pipes.push(pipe);
            saveRepository();
            return true;
        }
        return false;
    },
    removePipe: (pipe: [string, string]) => {
        systemImage.pipes = systemImage.pipes.filter((storedPipe) => storedPipe[0] !== pipe[0] || storedPipe[1] !== pipe[1]);
        saveRepository();
    },
    addDevicesToGroup: (groupName: string | undefined, deviceIds: string[]) => {
        deviceIds.forEach((id) => {
            const device = systemImage.devices.find((manifest) => manifest.id === id);
            const groupValue = (groupName !== undefined && groupName.length > 0) ? groupName : undefined;
            if (device) {
                device.group = groupValue;
            }
        });
        saveRepository();
    }
}

const getBasicRepository = () => {
    if (!systemImage) {
        try {
            const systemImageFile = fs.readFileSync('systemImage.json');
            systemImage = JSON.parse(systemImageFile.toString()) as SystemImage;
        } catch (err) {
            systemImage = {devices: [], pipes: []};
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
