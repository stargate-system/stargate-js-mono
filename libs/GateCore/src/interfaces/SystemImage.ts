import {ValidManifest} from "./ValidManifest";

export interface SystemImage {
    devices: ValidManifest[],
    pipes: [string, string][]
}