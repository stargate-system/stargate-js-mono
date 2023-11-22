import {createContext} from "react";
import {SystemModel} from "gate-viewmodel";

// @ts-ignore
const SystemModelContext = createContext<SystemModel>(null);

export default SystemModelContext;