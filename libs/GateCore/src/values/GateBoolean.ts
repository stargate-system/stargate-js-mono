import {AbstractValue} from "./api/AbstractValue.js";
import {ValueTypes} from "./ValueTypes.js";

export class GateBoolean extends AbstractValue<boolean> {
    constructor(id?: string) {
        super(id);
        this.setValue(false);
        this._type = ValueTypes.boolean;
    }

    toString = () => {
        return super.value ? '1' : '0';
    }

    fromRemote = (textValue: string) => {
        this._setRemoteValue(!(textValue === '0'));
    }
}