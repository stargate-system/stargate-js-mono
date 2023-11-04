import MessageMapper from "../messaging/MessageMapper.js";
import {GateValue} from "../values/GateValue";

export class OutputBuffer {
    private buffer = {};
    private readonly bufferDelay: number;
    private bufferTimeout: NodeJS.Timeout | undefined;
    private readonly sendFunction: (message: string) => void;

    constructor(sendFunction: (message: string) => void, bufferDelay?: number) {
        this.sendFunction = sendFunction;
        this.bufferDelay = bufferDelay ?? 0;
    }

    add(gateValue: GateValue<any>) {
        // @ts-ignore
        this.buffer[gateValue.id] = gateValue.toString();
        this.flushLater();
    }

    flush() {
        if (this.bufferTimeout) {
            clearTimeout(this.bufferTimeout);
            this.bufferTimeout = undefined;
        }
        if (this.hasContent()) {
            this.sendFunction(MessageMapper.serializeValueMessage(this.buffer));
            this.clear();
        }
    }

    private flushLater() {
        if (!this.bufferTimeout) {
            this.bufferTimeout = setTimeout(() => {
                this.bufferTimeout = undefined;
                this.flush();
            }, this.bufferDelay);
        }
    }

    clear() {
        this.buffer = {};
        if (this.bufferTimeout) {
            clearTimeout(this.bufferTimeout);
            this.bufferTimeout = undefined;
        }
    }

    hasContent() {
        return !!Object.keys(this.buffer).length;
    }
}