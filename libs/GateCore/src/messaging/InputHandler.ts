import Markers from "./Markers";
import MessageMapper from "./MessageMapper";

export class InputHandler {
    private readonly handleValueMessage: (changes: Array<[string, string]>) => void;
    private readonly handleFunctionalMessage: (message: string) => void;

    constructor(onValueMessage: (changes: Array<[string, string]>) => void, onFunctionalMessage: (message: string) => void) {
        this.handleValueMessage = onValueMessage;
        this.handleFunctionalMessage = onFunctionalMessage;
    }

    handleMessage(message: string) {
        const msg = message.toString();
        if (msg.charAt(0) === Markers.functionalMessagePrefix) {
            this.handleFunctionalMessage(msg);
        } else {
            this.handleValueMessage(MessageMapper.parseValueMessage(msg));
        }
    }
}