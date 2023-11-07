import {AbstractValue} from "./api/AbstractValue.js";
import {ValueTypes} from "./ValueTypes.js";

export class GateString extends AbstractValue<string> {
    constructor(id?: string) {
        super(id);
        this.setValue('');
        this._type = ValueTypes.string;
    }

    toString = (): string => {
        return super.value ?? '';
    }

    fromRemote = (textValue: string) => {
        this._setRemoteValue(textValue);
    }
}