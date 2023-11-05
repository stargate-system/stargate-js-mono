import {InputHandler} from "./InputHandler.js";
import MessageMapper from "./MessageMapper.js";
import {FunctionalHandler} from "./api/FunctionalHandler.js";
import MessagingFactory from "./api/MessagingFactory.js";
import {MessageHandler} from "./api/MessageHandler.js";

export class MessageHandlerImpl implements MessageHandler{
    private readonly _sendValueMessage: (message: string) => void;
    private readonly inputHandler: InputHandler;
    private readonly _functionalHandler: FunctionalHandler;

    constructor(sendFunction: (message: string) => void, onValueMessage: (changes: Array<[string, string]>) => void) {
        this._sendValueMessage = sendFunction;
        this._functionalHandler = MessagingFactory.getFunctionalHandler(sendFunction);
        this.inputHandler = new InputHandler(
            onValueMessage,
            (msg) => this._functionalHandler.handleFunctionalMessage(msg)
        );
    }

    sendValueMessage(messageMap: Map<string, string>) {
        const message = MessageMapper.serializeValueMessage(messageMap);
        this._sendValueMessage(message);
    }

    handleMessage(msg: string) {
        this.inputHandler.handleMessage(msg);
    }

    getFunctionalHandler() {
        return this._functionalHandler;
    }
}