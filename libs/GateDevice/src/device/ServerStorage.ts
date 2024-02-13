import {device} from "./GateDevice";
import keywords from "gate-core/dist/src/constants/Keywords";

const get = async (key: string, directory?: string) => {
    const params = [key];
    if (directory) {
        params.push(directory);
    }
    try {
        const value = await device.connection.functionalHandler.createQuery(keywords.storageGet, undefined, params);
        return value.length ? value : undefined;
    } catch (err) {
        console.log('On getting from ServerStorage', err);
        return undefined;
    }
}

const set = (key: string, value: string, directory?: string) => {
    const params = [key, value];
    if (directory) {
        params.push(directory);
    }
    device.connection.functionalHandler.sendCommand(keywords.storageSet, params);
}

const ServerStorage = {
    get,
    set
}

export default ServerStorage;
