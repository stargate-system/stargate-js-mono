import {ControllerConnector, EventName, SystemImage} from "gate-router";
import {Connection, ConnectionState, DefaultConnection, Keywords, SocketWrapper, ValueMessage} from "gate-core";

export class LocalControllerConnector implements ControllerConnector {
    id: string = '';
    onDisconnect: () => void = () => {};
    onSubscribed: (ids: string[]) => void = () => {};
    onUnsubscribed: (ids: string[]) => void  = () => {};
    onValueMessage: (valueMessage: ValueMessage) => void = () => {};
    onDeviceRemoved: (id: string) => void = () => {};

    private readonly _connection: Connection;

    constructor(socketWrapper: SocketWrapper) {
        this._connection = new DefaultConnection();
        this._connection.setConnected(socketWrapper);
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
        this._connection.setReady();
    }

    sendDeviceEvent = (event: EventName, data: string) => {
        this._connection.functionalHandler.sendCommand(event, [data]);
    }

    sendJoinData = (systemImage: SystemImage, connectedDevices: string[]) => {
        this._connection.functionalHandler.sendCommand(Keywords.joinData, [JSON.stringify(systemImage), ...connectedDevices]);
    }

    sendValueMessage = (valueMessage: ValueMessage) => {
        valueMessage.forEach((value) => this._connection.sendValue(value));
    }
}