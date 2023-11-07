import {Directions} from "./Directions";

export interface ValueManifest {
    id: string,
    type?: string,
    direction?: Directions,
    valueName?: string,
    options?: object
}