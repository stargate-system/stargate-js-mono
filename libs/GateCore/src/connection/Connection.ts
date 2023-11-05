import {ConnectionState} from "./ConnectionState";
import {Registry} from "../components/Registry";
import {MessageHandler} from "../messaging/api/MessageHandler";
import MessagingFactory from "../messaging/api/MessagingFactory";

export class Connection {
    private _state: ConnectionState;
    private readonly _stateChangeListeners: Registry<(connection: Connection) => void>
    private readonly _close: () => void;
    private readonly _handler: MessageHandler;

    constructor(sendFunction: (message: string) => void,
                closeFunction: () => void,
                onMessageSetter: (messageHandler: (message: string) => void) => void,
                onCloseSetter: (closeHandler: () => void) => void,
                onValueMessage: (changes: Array<[string, string]>) => void) {
        this._state = ConnectionState.connected;
        this._stateChangeListeners = new Registry<(connection: Connection) => void>();
        this._close = closeFunction;
        this._handler = MessagingFactory.getMessageHandler(sendFunction, onValueMessage);
        onMessageSetter(this._handler.handleMessage);
        onCloseSetter(() => this.state = ConnectionState.closed);
    }

    addStateChangeListener(callback: (connection: Connection) => void): string {
        return this._stateChangeListeners.add(callback);
    }

    removeStateChangeListener(key: string) {
        this._stateChangeListeners.remove(key);
    }

    close() {
        this._close();
        this.state = ConnectionState.closed;
    }

    get state(): ConnectionState {
        return this._state;
    }

    get handler(): MessageHandler {
        return this._handler;
    }

    set state(value: ConnectionState) {
        this._state = value;
        this._stateChangeListeners.getValues().forEach((callback) => callback(this));
    }
}