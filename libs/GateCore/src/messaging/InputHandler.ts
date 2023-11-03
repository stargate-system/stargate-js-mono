import {Markers} from "./ApiCommons";

export class InputHandler {
    private readonly handleValueMessage: (message: string) => void;
    private readonly handleFunctionalMessage: (message: string) => void;

    constructor(onValueMessage: (message: string) => void, onFunctionalMessage: (message: string) => void) {
        this.handleValueMessage = onValueMessage;
        this.handleFunctionalMessage = onFunctionalMessage;
    }

    handleMessage(message: string) {
        const msg = message.toString();
        if (msg.charAt(0) === Markers.functionalMessagePrefix) {
            this.handleFunctionalMessage(msg);
        } else {
            this.handleValueMessage(msg);
        }
    }
}