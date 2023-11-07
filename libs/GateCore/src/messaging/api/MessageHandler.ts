import {FunctionalHandler} from "./FunctionalHandler.js";
import {ValueMessage} from "../../api/commonTypes/ValueMessage";

export interface MessageHandler {
    sendValueMessage: (message: ValueMessage) => void,
    handleIncomingMessage: (msg: string) => void,
    getFunctionalHandler: () => FunctionalHandler
}