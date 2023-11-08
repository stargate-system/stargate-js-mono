import {ValueMessage} from "../../api/commonTypes/ValueMessage";
import {MessageHandler} from "./MessageHandler";
import {FunctionalHandler} from "./FunctionalHandler";

export interface MessagingFactory {
    getMessageHandler: (factory: MessagingFactory, sendFunction: (message: string) => void, onValueMessage: (changes: ValueMessage) => void) => MessageHandler,
    getFunctionalHandler: (sendFunction: (message: string) => void, queryTimeout?: number) => FunctionalHandler
}