import {Directions} from "../constants/Directions";

export interface ValueManifest {
    id: string,
    type?: string,
    direction?: Directions,
    visibility?: string,
    valueName?: string,
    info?: string,
    options?: object
}