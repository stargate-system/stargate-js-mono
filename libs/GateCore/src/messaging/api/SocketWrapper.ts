import {ConnectionState} from "../../api/commonConstants/ConnectionState.js";
import {Registry} from "../../api/commonComponents/Registry.js";
import {MessageHandler} from "./MessageHandler.js";
import DefaultMessagingFactory from "../DefaultMessagingFactory.js";
import {ValueMessage} from "../../api/commonTypes/ValueMessage.js";
import {MessagingFactory} from "./MessagingFactory";

export class SocketWrapper {
    private readonly _factory: MessagingFactory;
    private _state: ConnectionState = ConnectionState.closed;
    private readonly _stateChangeListeners= new Registry<(state: ConnectionState) => void>();
    private _close?: () => void;
    private _handler?: MessageHandler;

    constructor(factory?: MessagingFactory) {
        this._factory = factory ?? DefaultMessagingFactory
    }

    private _handleClose = () => {
        this._close = undefined;
        this._handler = undefined;
        if (this._state !== ConnectionState.closed) {
            this.setState(ConnectionState.closed);
        }
    }

    addStateChangeListener = (callback: (state: ConnectionState) => void): string => {
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
        this._handler = this._factory.getMessageHandler(this._factory, sendFunction, onValueMessage);
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
        this._stateChangeListeners.getValues().forEach((callback) => callback(this._state));
    }
}