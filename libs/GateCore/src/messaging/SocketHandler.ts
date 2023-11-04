import {FunctionalHandler} from "./FunctionalHandler.js";
import {InputHandler} from "./InputHandler.js";

export class SocketHandler {
    private readonly _sendMessage: (message: string) => void;
    private readonly inputHandler: InputHandler;
    private readonly _functionalHandler: FunctionalHandler;

    constructor(sendFunction: (message: string) => void, onValueMessage: (message: string) => void) {
        this._sendMessage = sendFunction;
        this._functionalHandler = new FunctionalHandler(sendFunction);
        this.inputHandler = new InputHandler(
            onValueMessage,
            (msg) => this._functionalHandler.onFunctionalMessage(msg)
        );
    }

    get sendMessage() {
        return (msg: string) => this._sendMessage(msg);
    }

    handleMessage(msg: string) {
        this.inputHandler.handleMessage(msg);
    }

    get functionalHandler() {
        return this._functionalHandler;
    }
}