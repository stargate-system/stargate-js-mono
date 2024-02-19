import {Connection, Keywords} from "gate-core";
import Router from "../Router";

export const setServerStorageRequestListeners = (connection: Connection, defaultDirectory: string) => {
    connection.functionalHandler.addCommandListener(Keywords.storageSet, (params) => {
        if (params && params.length > 1) {
            const [key, value, directory] = params;
            Router.serverStorage.set(directory ?? defaultDirectory, key, value);
        }
    });

    connection.functionalHandler.addCommandListener(Keywords.storageAppend, (params) => {
        if (params && params.length > 1) {
            const [key, value, directory] = params;
            Router.serverStorage.append(directory ?? defaultDirectory, key, value);
        }
    });

    connection.functionalHandler.addCommandListener(Keywords.storageRemove, (params) => {
        if (params && params.length > 1) {
            const [key, directory] = params;
            Router.serverStorage.remove(
                (directory && directory.length > 0) ? directory : defaultDirectory,
                (key && key.length > 0) ? key : undefined,
                true
            );
        }
    });

    connection.functionalHandler.addQueryListener(Keywords.storageGet, (respond, params) => {
        if (params && params.length > 0) {
            const [key, directory] = params;
            Router.serverStorage.get(directory ?? defaultDirectory, key).then((value) => {
                respond(value ?? '');
            });
        }
    });
}