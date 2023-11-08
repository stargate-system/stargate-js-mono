import MessageMapper from "./MessageMapper.js";
import {FunctionalHandler} from "./api/FunctionalHandler.js";
import {MessageHandler} from "./api/MessageHandler.js";
import Markers from "./Markers.js";
import {ValueMessage} from "../api/commonTypes/ValueMessage";
import {MessagingFactory} from "./api/MessagingFactory";

export class MessageHandlerImpl implements MessageHandler{
    private readonly _sendValueMessage: (message: string) => void;
    private readonly _functionalHandler: FunctionalHandler;
    private readonly _handleValueMessage: (changes: ValueMessage) => void;

    constructor(factory: MessagingFactory, sendFunction: (message: string) => void, onValueMessage: (changes: ValueMessage) => void) {
        this._sendValueMessage = sendFunction;
        this._functionalHandler = factory.getFunctionalHandler(sendFunction);
        this._handleValueMessage = onValueMessage;
    }

    sendValueMessage = (valueMessage: ValueMessage) => {
        const message = MessageMapper.serializeValueMessage(valueMessage);
        this._sendValueMessage(message);
    }

    handleIncomingMessage = (message: string) => {
        if (message.charAt(0) === Markers.functionalMessagePrefix) {
            this._functionalHandler.handleFunctionalMessage(message);
        } else {
            this._handleValueMessage(MessageMapper.parseValueMessage(message));
        }
    }

    getFunctionalHandler = () => {
        return this._functionalHandler;
    }
}