import {Connection, ConnectionState, Keywords, ValueMessage} from "gate-core";
import {ControllerConnector} from "./ControllerConnector";
import {EventName} from "gate-core";
import {SystemImage} from "gate-core";

export class LocalControllerConnector implements ControllerConnector {
    id: string = '';
    onDisconnect: () => void = () => {};
    onSubscribed: (ids: string[]) => void = () => {};
    onUnsubscribed: (ids: string[]) => void  = () => {};
    onValueMessage: (valueMessage: ValueMessage) => void = () => {};
    onDeviceRemoved: (id: string) => void = () => {};
    onDeviceRenamed: (id: string, newName: string) => void = () => {};
    onPipeCreated: (pipe: [string, string]) => void = () => {};
    onPipeRemoved: (pipe: [string, string]) => void = () => {};

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
        functionalHandler.addCommandListener(EventName.deviceRemoved, (params) => {
            if (params && params[0]) {
                this.onDeviceRemoved(params[0]);
            }
        });
        functionalHandler.addCommandListener(EventName.deviceRenamed, (params) => {
            if (params && params[0] && params[1]) {
                this.onDeviceRenamed(params[0], params[1]);
            }
        });
        functionalHandler.addCommandListener(EventName.pipeCreated, (params) => {
            if (params && params[0] && params[1]) {
                this.onPipeCreated([params[0], params[1]]);
            }
        });
        functionalHandler.addCommandListener(EventName.pipeRemoved, (params) => {
            if (params && params[0] && params[1]) {
                this.onPipeRemoved([params[0], params[1]]);
            }
        });
        this._connection.setReady();
    }

    sendDeviceEvent = (event: EventName, data: string[]) => {
        this._connection.functionalHandler.sendCommand(event, data);
    }

    sendJoinData = (systemImage: SystemImage, connectedDevices: string[]) => {
        this._connection.functionalHandler.sendCommand(Keywords.joinData, [JSON.stringify(systemImage), ...connectedDevices]);
    }

    sendValueMessage = (valueMessage: ValueMessage) => {
        valueMessage.forEach((value) => this._connection.sendValue(value));
    }
}