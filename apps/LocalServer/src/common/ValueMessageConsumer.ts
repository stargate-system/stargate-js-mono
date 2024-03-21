import {ValueMessage} from "@stargate-system/core";

export interface ValueMessageConsumer {
    id: string,
    sendValueMessage: (valueMessage: ValueMessage) => void
}