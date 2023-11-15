import {ConnectionState} from "../../api/commonConstants/ConnectionState.js";
import {SocketWrapper} from "./SocketWrapper.js";
import {GateValue} from "../../values/api/GateValue.js";
import {ValueMessage} from "../../api/commonTypes/ValueMessage.js";
import {FunctionalHandler} from "./FunctionalHandler.js";

export interface Connection {
    functionalHandler: FunctionalHandler,
    state: ConnectionState,
    addStateChangeListener: (callback: (state: ConnectionState) => void) => string,
    removeStateChangeListener: (key: string) => void,
    setConnected: (socketWrapper: SocketWrapper) => void,
    setReady: () => void,
    close: () => void,
    sendGateValue: (gateValue: GateValue<any>) => void,
    sendValue: (value: [string, string]) => void,
    onValueMessage?: (valueMessage: ValueMessage) => void
}