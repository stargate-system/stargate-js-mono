import {createContext} from "react";
import {Manifest} from "gate-core";

export const ActiveDevices = createContext<Array<string>>([]);
export const DevicesImage = createContext<Array<Manifest>>([]);