import {createContext} from "react";
import {Manifest} from "gate-core";

export const ConnectedDevices = createContext<Array<Manifest>>([]);