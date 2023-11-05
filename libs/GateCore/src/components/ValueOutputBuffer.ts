import {GateValue} from "../values/GateValue";

export class ValueOutputBuffer {
    private _buffer: Map<string, string>;
    private readonly _bufferDelay: number;
    private _bufferTimeout: NodeJS.Timeout | undefined;
    private _sendFunction: ((messageMap: Map<string, string>) => void) | undefined;

    constructor(sendFunction?: (messageMap: Map<string, string>) => void, bufferDelay?: number) {
        this._buffer = new Map<string, string>();
        this._sendFunction = sendFunction;
        this._bufferDelay = bufferDelay ?? 0;
    }

    add(gateValue: GateValue<any>) {
        // @ts-ignore
        this._buffer.set(gateValue.id, gateValue.toString());
        if (this._sendFunction) {
            this.flushLater();
        }
    }

    flush() {
        if (this._bufferTimeout) {
            clearTimeout(this._bufferTimeout);
            this._bufferTimeout = undefined;
        }
        if (this._sendFunction && this.hasContent()) {
            this._sendFunction(this._buffer);
            this.clear();
        }
    }

    clear() {
        this._buffer = new Map<string, string>();
        if (this._bufferTimeout) {
            clearTimeout(this._bufferTimeout);
            this._bufferTimeout = undefined;
        }
    }

    hasContent() {
        return !!this._buffer.size;
    }

    setSendFunction(sendFunction: ((messageMap: Map<string, string>) => void) | undefined) {
        this._sendFunction = sendFunction;
        this.flush();
    }

    private flushLater() {
        if (!this._bufferTimeout) {
            this._bufferTimeout = setTimeout(() => {
                this._bufferTimeout = undefined;
                this.flush();
            }, this._bufferDelay);
        }
    }
}