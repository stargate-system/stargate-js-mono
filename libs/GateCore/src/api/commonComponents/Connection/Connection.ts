import {ConnectionState} from "./ConnectionState.js";
import {Registry} from "../Registry.js";
import {MessageHandler} from "../../../messaging/api/MessageHandler.js";
import MessagingFactory from "../../../messaging/api/MessagingFactory.js";
import {ValueMessage} from "../../commonTypes/ValueMessage";

export class Connection {
    private _state: ConnectionState = ConnectionState.closed;
    private readonly _stateChangeListeners= new Registry<(connection: Connection) => void>();
    private _close: (() => void) | undefined;
    private _handler: MessageHandler | undefined;

    private _handleClose = () => {
        this._close = undefined;
        this._handler = undefined;
        if (this._state !== ConnectionState.closed) {
            this.setState(ConnectionState.closed);
        }
    }

    addStateChangeListener = (callback: (connection: Connection) => void): string => {
        return this._stateChangeListeners.add(callback);
    }

    removeStateChangeListener = (key: string) => {
        this._stateChangeListeners.remove(key);
    }

    close = () => {
        if (this._state !== ConnectionState.closed) {
            if (this._close) {
                this._close();
            }
            this._handleClose();
        }
    }

    setConnected = (sendFunction: (message: string) => void,
                 closeFunction: () => void,
                 onMessageSetter: (messageHandler: (message: string) => void) => void,
                 onCloseSetter: (closeHandler: () => void) => void,
                 onValueMessage: (changes: ValueMessage) => void) => {
        this._state = ConnectionState.connected;
        this._close = closeFunction;
        this._handler = MessagingFactory.getMessageHandler(sendFunction, onValueMessage);
        onMessageSetter(this._handler.handleIncomingMessage);
        onCloseSetter(this._handleClose);
    }

    get state(): ConnectionState {
        return this._state;
    }

    get handler(): MessageHandler | undefined {
        return this._handler;
    }

    setState = (value: ConnectionState) => {
        this._state = value;
        this._stateChangeListeners.getValues().forEach((callback) => callback(this));
    }
}