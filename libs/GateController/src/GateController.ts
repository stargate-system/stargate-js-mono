import {LocalServerConnector} from "./LocalServerConnector";
import {SystemModel} from "@stargate-system/model";

export const getSystemModel = (config?: Object) => {
    const connector = new LocalServerConnector(config);
    return new SystemModel(connector);
}