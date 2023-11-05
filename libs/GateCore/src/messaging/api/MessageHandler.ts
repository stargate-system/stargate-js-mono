import {FunctionalHandler} from "./FunctionalHandler.js";

export interface MessageHandler {
    sendValueMessage: (messageMap: Map<string, string>) => void,
    handleMessage: (msg: string) => void,
    getFunctionalHandler: () => FunctionalHandler
}