import {FunctionalHandler} from "./FunctionalHandler.js";
import {ValueMessage} from "../../commonTypes/ValueMessage";

export interface MessageHandler {
    sendValueMessage: (message: ValueMessage) => void,
    handleIncomingMessage: (msg: string) => void,
    getFunctionalHandler: () => FunctionalHandler
}