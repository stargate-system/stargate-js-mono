import {MessageHandlerImpl} from "../MessageHandlerImpl.js";
import {MessageHandler} from "./MessageHandler.js";
import {FunctionalHandlerImpl} from "../FunctionalHandlerImpl.js";
import {FunctionalHandler} from "./FunctionalHandler.js";

const getMessageHandler = (sendFunction: (message: string) => void, onValueMessage: (changes: Array<[string, string]>) => void): MessageHandler => {
    return new MessageHandlerImpl(sendFunction, onValueMessage);
}

const getFunctionalHandler = (sendFunction: (message: string) => void, queryTimeout?: number): FunctionalHandler => {
    return new FunctionalHandlerImpl(sendFunction, queryTimeout);
}

const MessagingFactory = {
    getMessageHandler,
    getFunctionalHandler
}

export default MessagingFactory;
