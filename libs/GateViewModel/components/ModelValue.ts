import {ModelNode} from "./ModelNode";

export class ModelValue<T> extends ModelNode<() => void>{
    private _value?: T;

    constructor(value: T) {
        super();
        this._value = value;
    }

    get value() {
        return this._value;
    }

    setValue = (value: T) => {
        this._value = value;
        this._notify((callback) => callback());
    }
}