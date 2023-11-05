import {Connection} from "../../Connection";
import {Keywords} from '../../../../index';

let stateChangeListenerKey: string;

const basicHandshakeLeader = async (connection: Connection,
                                    onSuccess: (manifest: Object) => void,
                                    onFailure: (reason: string) => void) => {
    stateChangeListenerKey = connection.addStateChangeListener(() => clearListeners(connection));
    const functionalHandler = connection.handler.getFunctionalHandler();
    const manifest = await functionalHandler.createQuery(Keywords.manifest).catch((err) => onFailure(err.toString()));
    if (manifest) {
        onSuccess(JSON.parse(manifest));
        functionalHandler.sendCommand(Keywords.ready);
    }
    clearListeners(connection);
}

const clearListeners = (connection: Connection) => {
    connection.removeStateChangeListener(stateChangeListenerKey);
}