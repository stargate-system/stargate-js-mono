import {Connection} from "@stargate-system/core";
import { BaseControllerConnector } from "./BaseControllerConnector";
import {
    initRemote,
    setRemoteCredentials,
    stopRemote,
    getRemoteAccessState,
    createRemoteAccessPoint
} from "../RemoteService";

export class LocalControllerConnector extends BaseControllerConnector {
    constructor(connection: Connection) {
        super(connection);
        // TODO move remoteAccess to EventNames
        this._connection.functionalHandler.addCommandListener('remoteAccess', (params) => {
            if (params) {
                if (params.length === 2) {
                    setRemoteCredentials(params[0], params[1]);
                } else if (params[0] === 'on') {
                    initRemote();
                } else {
                    stopRemote();
                }
            }
        });
        // TODO move addRemote to EventNames
        this._connection.functionalHandler.addCommandListener('addRemote', () => {
            const remote = createRemoteAccessPoint();
            console.log(remote ? `${remote.name} - id: ${remote.id} pass: ${remote.password}` : 'Failed to create remote');
        });
        // TODO move remoteAccess to EventNames
        this.sendServerEvent('remoteAccess', [getRemoteAccessState()]);
    }

    sendServerEvent = (event: string, data: string[]) => {
        // TODO move serverEvent to Keywords
        this._connection.functionalHandler.sendCommand('serverEvent', [event, ...data]);
    }
}