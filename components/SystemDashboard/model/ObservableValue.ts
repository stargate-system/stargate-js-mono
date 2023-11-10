import {AbstractValue} from "gate-core";
import {ObservableNode} from "./ObservableNode";

export class ObservableValue<T extends AbstractValue<any>> extends ObservableNode{
    private readonly _gateValue: T;

    constructor(gateValue: T) {
        super();
        this._gateValue = gateValue;
        gateValue.onRemoteUpdate = () => {
            this._notify();
        };
    }

    get gateValue(): T {
        return this._gateValue;
    }
}
