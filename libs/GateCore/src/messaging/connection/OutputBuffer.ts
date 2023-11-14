import {AbstractValue} from "../../values/api/AbstractValue.js";
import {ValueMessage} from "../../api/commonTypes/ValueMessage.js";
import MessageMapper from "../MessageMapper.js";
import {ConnectionConfig} from "../api/ConnectionConfig.js";

export class OutputBuffer {
    private _buffer: Map<string, string> = new Map<string, string>();
    private readonly _bufferDelay: number;
    private _bufferTimeout: NodeJS.Timeout | undefined;
    private _sendFunction: ((message: string) => void) | undefined;

    constructor(config?: ConnectionConfig) {
        this._bufferDelay = config?.outputBufferDelay !== undefined ? config.outputBufferDelay : 0;
    }

    sendGateValue = (gateValue: AbstractValue<any>) => {
        if (this._sendFunction && gateValue.id) {
            this._buffer.set(gateValue.id, gateValue.toString());
            this._flushLater();
        }
    }

    sendValue = (value: [string, string]) => {
        if (this._sendFunction) {
            this._buffer.set(value[0], value[1]);
            this._flushLater();
        }
    }

    setConnected = (sendFunction: ((message: string) => void) | undefined) => {
        this._clear();
        this._sendFunction = sendFunction;
    }

    close = () => {
        this._clear();
        this._sendFunction = undefined;
    }

    private _toString = (): string => {
        const valueMessage: ValueMessage = [...this._buffer.entries()];
        return MessageMapper.serializeValueMessage(valueMessage);
    }

    private _flush = () => {
        if (this._sendFunction && this._hasContent()) {
            this._sendFunction(this._toString());
            this._clear();
        }
    }

    private _clear = () => {
        this._buffer = new Map<string, string>();
        if (this._bufferTimeout) {
            clearTimeout(this._bufferTimeout);
            this._bufferTimeout = undefined;
        }
    }

    private _hasContent = () => {
        return !!this._buffer.size;
    }

    private _flushLater = () => {
        if (!this._bufferTimeout) {
            this._bufferTimeout = setTimeout(() => {
                this._bufferTimeout = undefined;
                this._flush();
            }, this._bufferDelay);
        }
    }
}