import {SocketWrapper} from "../interfaces/SocketWrapper.js";
import {ConnectionState} from "../../../constants/ConnectionState.js";
import {OutputBuffer} from "./OutputBuffer.js";
import {ConnectionConfig} from "../../../api/ConnectionConfig.js";
import {DefaultFunctionalHandler} from "./DefaultFunctionalHandler.js";
import Markers from "../constants/Markers.js";
import MessageMapper from "./MessageMapper.js";
import {ValueMessage} from "../../../interfaces/ValueMessage.js";
import {GateValue} from "../../values/components/GateValue.js";
import {Registry} from "../../Registry.js";
import {Connection} from "../interfaces/Connection.js";
import {FunctionalHandler} from "../interfaces/FunctionalHandler.js";

export class DefaultConnection implements Connection{
    private _socket?: SocketWrapper;
    private _state: ConnectionState;
    private readonly _buffer: OutputBuffer
    private readonly _functionalHandler: FunctionalHandler;
    private readonly _stateChangeListeners;

    constructor(config?: ConnectionConfig) {
        this._state = ConnectionState.closed;
        this._buffer = new OutputBuffer(config);
        this._functionalHandler = new DefaultFunctionalHandler(config);
        this._stateChangeListeners = new Registry<(state: ConnectionState) => void>();
    }

    get state() {
        return this._state;
    }

    get functionalHandler() {
        return this._functionalHandler;
    }

    addStateChangeListener = (callback: (state: ConnectionState) => void): string => {
        return this._stateChangeListeners.add(callback);
    }

    removeStateChangeListener = (key: string) => {
        this._stateChangeListeners.remove(key);
    }

    setConnected = (socketWrapper: SocketWrapper) => {
        this._socket = socketWrapper;
        this._socket.setOnClose(this._handleClosed);
        this._socket.setOnMessage(this._handleIncomingMessage);
        this._functionalHandler.setConnected(this._socket.send);
        this._changeState(ConnectionState.connected);
    }

    setReady = () => {
        this._buffer.setConnected(this._socket?.send);
        this._changeState(ConnectionState.ready);
    }

    close = () => {
        this._socket?.close();
        this._handleClosed();
    }

    sendGateValue = (gateValue: GateValue<any>) => {
        this._buffer.sendGateValue(gateValue);
    }

    sendValue = (value: [string, string]) => {
        this._buffer.sendValue(value);
    }

    onValueMessage?: (valueMessage: ValueMessage) => void

    private _changeState = (newState: ConnectionState) => {
        if (this._state !== newState) {
            this._state = newState;
            this._stateChangeListeners.getValues().forEach((callback) => callback(this._state));
        }
    }

    private _handleClosed = () => {
        this._buffer.close();
        this._functionalHandler.close();
        this._changeState(ConnectionState.closed);
    }

    private _handleIncomingMessage = (message: string) => {
        if (message.charAt(0) === Markers.functionalMessagePrefix) {
            this._functionalHandler.handleFunctionalMessage(message);
        } else {
            if (this.onValueMessage) {
                try {
                    this.onValueMessage(MessageMapper.parseValueMessage(message));
                } catch (err) {
                    console.log('On handling value message: ' + err);
                }
            }
        }
    }
}