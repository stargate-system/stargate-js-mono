import {MessageHandlerImpl} from "../MessageHandlerImpl";
import {MessageHandler} from "./MessageHandler";
import {FunctionalHandlerImpl} from "../FunctionalHandlerImpl";
import {FunctionalHandler} from "./FunctionalHandler";

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
