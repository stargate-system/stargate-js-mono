import {Directions} from "../constants/Directions";

export interface ValueManifest {
    id: string,
    type?: string,
    direction?: Directions,
    valueName?: string,
    options?: object
}