import ApiCommons from "./ApiCommons.js";

export class InputHandler {
    #handleValueMessage;
    #handleFunctionalMessage;

    constructor(onValueMessage, onFunctionalMessage) {
        this.#handleValueMessage = onValueMessage;
        this.#handleFunctionalMessage = onFunctionalMessage;
    }

    handleMessage(message) {
        const msg = message.toString();
        if (msg.charAt(0) === ApiCommons.Markers.functionalMessagePrefix) {
            this.#handleFunctionalMessage(msg);
        } else {
            this.#handleValueMessage(msg);
        }
    }
}