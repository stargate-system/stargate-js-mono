import {FunctionalHandler} from "./FunctionalHandler.js";
import {InputHandler} from "./InputHandler.js";

export class SocketHandler {
    #sendFunction;
    #inputHandler;
    #functionalHandler;

    constructor(sendFunction, onValueMessage) {
        this.#sendFunction = sendFunction;
        this.#functionalHandler = new FunctionalHandler(sendFunction);
        this.#inputHandler = new InputHandler(
            onValueMessage,
            (msg) => this.#functionalHandler.onFunctionalMessage(msg)
        );
    }

    get sendFunction() {
        return (msg) => this.sendFunction(msg);
    }

    get onMessage() {
        return (msg) => this.#inputHandler.handleMessage(msg);
    }

    get functionalHandler() {
        return this.#functionalHandler;
    }
}