import {ValueMessage} from "gate-core";

export interface Connector {
    id: string | undefined;
    handleValueMessage: (valueMessage: ValueMessage) => void;
    onValueMessage: (valueMessage: ValueMessage) => void;
    onDisconnect: () => void;
}