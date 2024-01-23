import {LocalServerConnector} from "./LocalServerConnector";
import {SystemModel} from "gate-viewmodel";

export const getSystemModel = (config?: Object) => {
    const connector = new LocalServerConnector(config);
    return new SystemModel(connector);
}