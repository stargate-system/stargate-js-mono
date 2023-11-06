import MessageMapper from "./MessageMapper.js";
import {FunctionalHandler} from "./api/FunctionalHandler.js";
import MessagingFactory from "./api/MessagingFactory.js";
import {MessageHandler} from "./api/MessageHandler.js";
import Markers from "./Markers.js";

export class MessageHandlerImpl implements MessageHandler{
    private readonly _sendValueMessage: (message: string) => void;
    private readonly _functionalHandler: FunctionalHandler;
    private readonly _handleValueMessage: (changes: Array<[string, string]>) => void;

    constructor(sendFunction: (message: string) => void, onValueMessage: (changes: Array<[string, string]>) => void) {
        this._sendValueMessage = sendFunction;
        this._functionalHandler = MessagingFactory.getFunctionalHandler(sendFunction);
        this._handleValueMessage = onValueMessage;
    }

    sendValueMessage(messageMap: Map<string, string>) {
        const message = MessageMapper.serializeValueMessage(messageMap);
        this._sendValueMessage(message);
    }

    handleIncomingMessage(message: string) {
        if (message.charAt(0) === Markers.functionalMessagePrefix) {
            this._functionalHandler.handleFunctionalMessage(message);
        } else {
            this._handleValueMessage(MessageMapper.parseValueMessage(message));
        }
    }

    getFunctionalHandler() {
        return this._functionalHandler;
    }
}