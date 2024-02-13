import {Connection} from "gate-core";
import keywords from "gate-core/dist/src/constants/Keywords";
import Router from "../Router";

export const setServerStorageRequestListeners = (connection: Connection, defaultDirectory: string) => {
    connection.functionalHandler.addCommandListener(keywords.storageSet, (params) => {
        if (params && params.length > 1) {
            const [key, value, directory] = params;
            Router.serverStorage.set(directory ?? defaultDirectory, key, value);
        }
    });

    connection.functionalHandler.addQueryListener(keywords.storageGet, (respond, params) => {
        if (params && params.length > 0) {
            const [key, directory] = params;
            Router.serverStorage.get(directory ?? defaultDirectory, key).then((value) => {
                respond(value ?? '');
            });
        }
    });
}