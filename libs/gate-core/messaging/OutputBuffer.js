import MessageMapper from "./MessageMapper.js";
import config from "../config.js";

let buffer = {};
let bufferTimeout;

const add = (gateValue) => {
    buffer[gateValue.id] = gateValue.toString();
    OutputBuffer.onContent();
    flushLater();
}

const flush = () => {
    if (bufferTimeout) {
        clearTimeout(bufferTimeout);
        bufferTimeout = undefined;
    }
    if (hasContent()) {
        config.outputBufferSendFunction(MessageMapper.serialize(buffer));
        clear();
    }
}

const flushLater = () => {
    if (!bufferTimeout) {
        bufferTimeout = setTimeout(() => {
            bufferTimeout = undefined;
            flush();
        }, config.outputBufferDelay);
    }
}

const clear = () => {
    buffer = {};
    if (bufferTimeout) {
        clearTimeout(bufferTimeout);
        bufferTimeout = undefined;
    }
}

const hasContent = () => !!Object.keys(buffer).length;

const OutputBuffer = {
    onContent: () => {},
    add,
    flush,
    clear,
    hasContent
}
export default OutputBuffer;