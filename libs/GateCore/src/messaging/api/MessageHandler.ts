import {FunctionalHandler} from "./FunctionalHandler.js";

export interface MessageHandler {
    sendValueMessage: (messageMap: Map<string, string>) => void,
    handleIncomingMessage: (msg: string) => void,
    getFunctionalHandler: () => FunctionalHandler
}