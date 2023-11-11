import {SystemImage} from "./SystemImage";
import {ValidManifest} from "../context/deviceContext/api/ValidManifest";
import {Manifest} from "gate-core";

export interface SystemRepository {
    getSystemImage: () => Promise<SystemImage>
    createDevice: (manifest: Manifest) => Promise<ValidManifest>
}