import {Manifest} from "./Manifest";

export interface ValidManifest extends Manifest {
    uuid: string
    id: string
}