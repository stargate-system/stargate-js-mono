import {SystemImage, Manifest, ValidManifest} from "@stargate-system/core";

export interface SystemRepository {
    getSystemImage: () => Promise<SystemImage>,
    createDevice: (manifest: Manifest) => Promise<ValidManifest>,
    updateDevice: (manifest: ValidManifest) => Promise<ValidManifest>,
    overwriteDevice: (manifest: ValidManifest) => Promise<boolean>,
    removeDevice: (id: string) => void,
    renameDevice: (id: string, newName: string) => void,
    createPipe: (pipe: [string, string]) => Promise<boolean>,
    removePipe: (pipe: [string, string]) => void,
    addDevicesToGroup: (groupName: string | undefined, deviceIds: string[]) => void
}