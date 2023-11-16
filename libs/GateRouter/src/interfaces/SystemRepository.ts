import {SystemImage} from "./SystemImage";
import {ValidManifest} from "./ValidManifest";
import {Manifest} from "gate-core";

export interface SystemRepository {
    getSystemImage: () => Promise<SystemImage>
    createDevice: (manifest: Manifest) => Promise<ValidManifest>
}