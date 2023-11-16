import {createContext} from "react";
import {SystemModel} from "gate-viewmodel";

const SystemModelContext = createContext<SystemModel>(null);

export default SystemModelContext;