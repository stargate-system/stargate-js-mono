import {ValueMessage} from "gate-core";

export interface ValueMessageConsumer {
    id: string,
    sendValueMessage: (valueMessage: ValueMessage) => void
}