import {ValueManifest} from "../../values/api/ValueManifest";

export interface Manifest {
    id?: string,
    deviceName?: string,
    values: ValueManifest[]
}