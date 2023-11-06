import {ValueMessage} from "gate-core";

export interface Connector {
    id: string;
    handleValueMessage: (valueMessage: ValueMessage) => void;
    onValueMessage: (valueMessage: ValueMessage) => void;
    onDisconnect: () => void;
}