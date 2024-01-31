import {createContext} from "react";
import {SystemModel} from "gate-viewmodel";

// @ts-ignore
const SystemModelContext = createContext<SystemModel>(new SystemModel());

export default SystemModelContext;