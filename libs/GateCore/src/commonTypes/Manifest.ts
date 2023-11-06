import {Directions} from "../values/api/Directions";

export interface Manifest {
    id?: string,
    deviceName?: string,
    values?: Array<{
        id: string,
        valueName?: string,
        type?: string,
        direction?: Directions
        options?: object
    }>
}