import {FunctionalHandler} from "./FunctionalHandler";

export interface MessageHandler {
    sendValueMessage: (messageMap: Map<string, string>) => void,
    handleMessage: (msg: string) => void,
    getFunctionalHandler: () => FunctionalHandler
}