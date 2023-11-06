import {Directions} from "./Directions.js";

export class GateValue<T> {
    private static nextId = 1;
    private readonly _id: string;
    private _value: T | undefined;
    protected _type: string | undefined;
    valueName: string | undefined;
    direction: Directions | undefined;
    onLocalUpdate: ((value: GateValue<T>) => void) | undefined;
    onRemoteUpdate: ((value: GateValue<T>) => void) | undefined;

    constructor(id?: string) {
        if (id !== undefined) {
            this._id = id;
        } else {
            const generatedId = GateValue.nextId++;
            this._id = generatedId.toString();
        }
    }

    get id(): string {
        return this._id;
    }

    get type(): string | undefined {
        return this._type;
    }

    get value(): T | undefined {
        return this._value;
    }

    protected _setLocalValue = (value: T | undefined) => {
        this._value = value;
        if (this.onLocalUpdate) {
            this.onLocalUpdate(this);
        }
    }

    setValue = (value: T | undefined) => {
        this._setLocalValue(value);
    }

    protected _setRemoteValue = (value: T | undefined) => {
        if (this.direction === Directions.input) {
            this.setValue(value);
        } else {
            this._value = value;
        }
        if (this.onRemoteUpdate) {
            this.onRemoteUpdate(this);
        }
    }

    toString = (): string => {
        throw new Error('Not implemented');
    }

    fromRemote = (textValue: string): void => {
        throw new Error('Not implemented');
    }

    toManifest() {
        const manifest: Object = {
            id: this._id,
        }
        if (this._type !== undefined) {
            // @ts-ignore
            manifest.type = this._type;
        }
        if (this.valueName !== undefined) {
            // @ts-ignore
            manifest.name = this.valueName;
        }
        if (this.direction !== undefined) {
            // @ts-ignore
            manifest.direction = this.direction;
        }
        return manifest;
    };
}