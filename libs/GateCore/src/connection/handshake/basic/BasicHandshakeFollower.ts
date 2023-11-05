import {Connection} from "../../Connection";
import {Keywords} from '../../../../index';
import {ConnectionState} from "../../ConnectionState";

let stateListenerKey: string;

const basicHandshakeFollower = (connection: Connection, manifest: Object)=> {
    const functionalHandler = connection.handler.getFunctionalHandler();
    stateListenerKey = connection.addStateChangeListener(() => clearListeners(connection));
    functionalHandler.addQueryListener(Keywords.manifest, (respond) => respond(JSON.stringify(manifest)));
    functionalHandler.addCommandListener(Keywords.ready, () => {
        connection.state = ConnectionState.ready;
        clearListeners(connection);
    });
}

const clearListeners = (connection: Connection) => {
    connection.removeStateChangeListener(stateListenerKey);
    const functionalHandler = connection.handler.getFunctionalHandler();
    functionalHandler.removeQueryListener(Keywords.manifest);
    functionalHandler.removeCommandListener(Keywords.ready);
}

export default basicHandshakeFollower;
