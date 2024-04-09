import {createContext} from "react";
import {SystemModel} from "@stargate-system/model";

// @ts-ignore
const SystemModelContext = createContext<SystemModel>(new SystemModel());

export default SystemModelContext;