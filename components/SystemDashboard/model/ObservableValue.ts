import {AbstractValue} from "gate-core";
import {ObservableNode} from "./ObservableNode";
import ConnectionService from "../service/ConnectionService";

export class ObservableValue<T extends AbstractValue<any>> extends ObservableNode{
    private readonly _gateValue: T;

    constructor(gateValue: T) {
        super();
        this._gateValue = gateValue;
        // TODO implement correctly
        gateValue.onLocalUpdate = () => ConnectionService.connector?.handleValueMessage([[gateValue.id, gateValue.toString()]])
        gateValue.onRemoteUpdate = () => {
            this._notify();
        };
    }

    get gateValue(): T {
        return this._gateValue;
    }
}
