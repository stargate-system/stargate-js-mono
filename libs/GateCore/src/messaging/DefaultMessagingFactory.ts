import {MessageHandlerImpl} from "./MessageHandlerImpl.js";
import {MessageHandler} from "./api/MessageHandler.js";
import {FunctionalHandlerImpl} from "./FunctionalHandlerImpl.js";
import {FunctionalHandler} from "./api/FunctionalHandler.js";
import {ValueMessage} from "../api/commonTypes/ValueMessage";
import {MessagingFactory} from "./api/MessagingFactory";

const getMessageHandler = (factory: MessagingFactory, sendFunction: (message: string) => void, onValueMessage: (changes: ValueMessage) => void): MessageHandler => {
    return new MessageHandlerImpl(factory, sendFunction, onValueMessage);
}

const getFunctionalHandler = (sendFunction: (message: string) => void, queryTimeout?: number): FunctionalHandler => {
    return new FunctionalHandlerImpl(sendFunction, queryTimeout);
}

const DefaultMessagingFactory: MessagingFactory = {
    getMessageHandler,
    getFunctionalHandler
}

export default DefaultMessagingFactory;
