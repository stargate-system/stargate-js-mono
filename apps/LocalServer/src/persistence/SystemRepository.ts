import {SystemImage, Manifest, ValidManifest} from "gate-core";

export interface SystemRepository {
    getSystemImage: () => Promise<SystemImage>,
    createDevice: (manifest: Manifest) => Promise<ValidManifest>,
    updateDevice: (manifest: ValidManifest) => Promise<ValidManifest>,
    removeDevice: (id: string) => void,
    renameDevice: (id: string, newName: string) => void,
    createPipe: (pipe: [string, string]) => boolean,
    removePipe: (pipe: [string, string]) => void,
    addDevicesToGroup: (groupName: string | undefined, deviceIds: string[]) => void
}