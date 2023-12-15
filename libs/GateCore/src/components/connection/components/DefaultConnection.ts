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
import Keywords from "../../../constants/Keywords";

export class DefaultConnection implements Connection{
    private _socket?: SocketWrapper;
    private _state: ConnectionState;
    private readonly _buffer: OutputBuffer
    private readonly _functionalHandler: FunctionalHandler;
    private readonly _stateChangeListeners;
    private readonly _leader: boolean;
    private _failedPings: number = 0;
    private _pingTimeout?: NodeJS.Timeout;
    ping?: number;
    onPingChange?: (ping: number) => void;

    constructor(leader?: boolean, config?: ConnectionConfig) {
        this._leader = leader ?? false;
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
        if (this._leader) {
            this._checkPing();
        } else {
            this._functionalHandler.addQueryListener(Keywords.ping, (respond) => {
                respond('1');
                this._watchPing();
            });
            this._watchPing();
        }
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

    private _checkPing = async () => {
        if (this._state !== ConnectionState.closed) {
            const startTime = Date.now();
            const response = await this._functionalHandler.createQuery(Keywords.ping, 1000)
                .catch(() => this._failedPings += 1);
            this.ping = (Date.now() - startTime)/2;
            if (this._failedPings === 3) {
                this.close();
            } else {
                if (response) {
                    this._failedPings = 0;
                    if (this.onPingChange) {
                        this.onPingChange(this.ping);
                    }
                }
                setTimeout(this._checkPing, 3000);
            }
        }
    }

    private _watchPing = () => {
        if (this._pingTimeout) {
            clearTimeout(this._pingTimeout);
        }
        this._pingTimeout = setTimeout(() => {
            this.close();
        }, 10000);
    }

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