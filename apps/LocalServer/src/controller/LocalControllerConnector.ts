import {Connection, ConnectionState, Keywords, ValueMessage} from "@stargate-system/core";
import {ControllerConnector} from "./ControllerConnector";
import {SystemImage} from "@stargate-system/core";
import {setServerStorageRequestListeners} from "../common/ServerStorageRequestListener";

export class LocalControllerConnector implements ControllerConnector {
    id: string = '';
    onDisconnect: () => void = () => {};
    onSubscribed: (ids: string[]) => void = () => {};
    onUnsubscribed: (ids: string[]) => void  = () => {};
    onValueMessage: (valueMessage: ValueMessage) => void = () => {};
    onDeviceEvent: (event: string, data: string[]) => void = () => {};
    onPipeEvent: (event: string, data: string[]) => void = () => {};

    private readonly _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
        this._connection.addStateChangeListener((state) => {
            if (state === ConnectionState.closed) {
                this.onDisconnect();
            }
        })
        this._connection.onValueMessage = (msg) => this.onValueMessage(msg);
        const functionalHandler = this._connection.functionalHandler;
        functionalHandler.addCommandListener(Keywords.subscribe, (params) => {
            this.onSubscribed(params ?? []);
        });
        functionalHandler.addCommandListener(Keywords.unsubscribe, (params) => {
            this.onUnsubscribed(params ?? []);
        });
        functionalHandler.addCommandListener(Keywords.deviceEvent, (params) => {
            if (params && params[0]) {
                const eventName = params[0];
                this.onDeviceEvent(eventName, params.slice(1));
            }
        });
        functionalHandler.addCommandListener(Keywords.pipeEvent, (params) => {
            if (params && params[0]) {
                const eventName = params[0];
                this.onPipeEvent(eventName, params.slice(1));
            }
        });
        setServerStorageRequestListeners(this._connection, 'controller');
        this._connection.setReady();
    }

    sendDeviceEvent = (event: string, data: string[]) => {
        this._connection.functionalHandler.sendCommand(Keywords.deviceEvent, [event, ...data]);
    }

    sendPipeEvent = (event: string, data: string[]) => {
        this._connection.functionalHandler.sendCommand(Keywords.pipeEvent, [event, ...data]);
    }

    sendJoinData = (systemImage: SystemImage, connectedDevices: string[]) => {
        this._connection.functionalHandler.sendCommand(Keywords.joinData, [JSON.stringify(systemImage), ...connectedDevices]);
    }

    sendValueMessage = (valueMessage: ValueMessage) => {
        valueMessage.forEach((value) => this._connection.sendValue(value));
    }
}