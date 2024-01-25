import {ValueManifest} from "../components/values/interfaces/ValueManifest";

export interface Manifest {
    id?: string,
    deviceName?: string,
    values: ValueManifest[],
    group?: string
}