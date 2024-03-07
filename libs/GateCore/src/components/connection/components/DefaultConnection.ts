import {SocketWrapper} from "../interfaces/SocketWrapper.js";
import {ConnectionState} from "../../../constants/ConnectionState.js";
import {OutputBuffer} from "./OutputBuffer.js";
import {ConnectionConfig} from "../../../interfaces/ConnectionConfig.js";
import {DefaultFunctionalHandler} from "./DefaultFunctionalHandler.js";
import Markers from "../../../constants/Markers.js";
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
    private readonly _leader: boolean;
    private _inboundTimeout?: NodeJS.Timeout;
    private _pingTimeout?: NodeJS.Timeout;
    ping?: number;
    onPingChange?: (ping: number) => void;

    constructor(leader?: boolean, config?: ConnectionConfig) {
        this._leader = leader ?? false;
        this._state = ConnectionState.closed;
        this._buffer = new OutputBuffer((ping) => {
            this.ping = ping;
            if (this.onPingChange) {
                this.onPingChange(ping);
            }
        });
        this._functionalHandler = new DefaultFunctionalHandler(this, config);
        this._stateChangeListeners = new Registry<(state: ConnectionState) => void>();
    }

    get state() {
        return this._state;
    };

    get functionalHandler() {
        return this._functionalHandler;
    };

    get outputBuffer(): OutputBuffer {
        return this._buffer;
    };

    addStateChangeListener = (callback: (state: ConnectionState) => void): string => {
        return this._stateChangeListeners.add(callback);
    };

    removeStateChangeListener = (key: string) => {
        this._stateChangeListeners.remove(key);
    };

    setConnected = (socketWrapper: SocketWrapper) => {
        if (this._state !== ConnectionState.closed) {
            this.close();
        }
        this._socket = socketWrapper;
        this._socket.setOnClose(this._handleClosed);
        this._socket.setOnMessage(this._handleIncomingMessage);
        this._buffer.setConnected(this._socket?.send);
        this._functionalHandler.setConnected(this._buffer.sendFunctionalMessage);
        this._changeState(ConnectionState.connected);
        this.resetTimeouts();
    };

    setReady = () => {
        this._changeState(ConnectionState.ready);
    };

    close = () => {
        if (this._socket) {
            this._socket.close();
        }
        this._handleClosed();
    };

    sendGateValue = (gateValue: GateValue<any>) => {
        this._buffer.sendGateValue(gateValue);
    };

    sendValue = (value: [string, string]) => {
        this._buffer.sendValue(value);
    };

    handleValueMessage = (message: string) => {
        if (this.onValueMessage) {
            try {
                this.onValueMessage(MessageMapper.parseValueMessage(message));
            } catch (err) {
                console.log('On handling value message: ' + err);
            }
        }
    };

    onValueMessage?: (valueMessage: ValueMessage) => void;

    private _changeState = (newState: ConnectionState) => {
        if (this._state !== newState) {
            this._state = newState;
            this._stateChangeListeners.getValues().forEach((callback) => callback(this._state));
        }
    };

    private _handleClosed = () => {
        this._buffer.close();
        this._functionalHandler.close();
        this._changeState(ConnectionState.closed);
        this._socket = undefined;
        this.clearTimeouts();
    };

    private _handleIncomingMessage = (message: string) => {
        this.resetTimeouts();
        if (message.charAt(0) === Markers.functionalMessagePrefix) {
            this._functionalHandler.handleFunctionalMessage(message);
        } else {
            this.handleValueMessage(message);
            this._buffer.sendAcknowledge();
        }
    };

    private resetTimeouts = () => {
        this.clearTimeouts();
        this._inboundTimeout = setTimeout(() => {
            this.close();
        }, 7000);
        if (this._leader) {
            this._pingTimeout = setTimeout(() => {
                this.functionalHandler.sendPing();
            }, 2000);
        }
    }

    private clearTimeouts = () => {
        if (this._inboundTimeout) {
            try {
                clearTimeout(this._inboundTimeout);
            } catch (err) {}
            this._inboundTimeout = undefined;
        }
        if (this._pingTimeout) {
            try {
                clearTimeout(this._pingTimeout);
            } catch (err) {}
            this._pingTimeout = undefined;
        }
    }
}