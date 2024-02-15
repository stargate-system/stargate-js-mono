import {Connection} from "./connection/interfaces/Connection";
import keywords from "../constants/Keywords";

export class ServerStorage {
    private readonly _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
    }

    get = async (key: string, directory?: string) => {
        const params = [key];
        if (directory) {
            params.push(directory);
        }
        try {
            const value = await this._connection.functionalHandler.createQuery(keywords.storageGet, undefined, params);
            return value.length ? value : undefined;
        } catch (err) {
            console.log('On getting from ServerStorage', err);
            return undefined;
        }
    }

    set = (key: string, value: string, directory?: string) => {
        const params = [key, value];
        if (directory) {
            params.push(directory);
        }
        this._connection.functionalHandler.sendCommand(keywords.storageSet, params);
    }

    append = (key: string, value: string, directory?: string) => {
        const params = [key, value];
        if (directory) {
            params.push(directory);
        }
        this._connection.functionalHandler.sendCommand(keywords.storageAppend, params);
    }

    remove = (key?: string, directory?: string) => {
        const params = [key ?? '', directory ?? ''];
        this._connection.functionalHandler.sendCommand(keywords.storageRemove, params);
    }
}