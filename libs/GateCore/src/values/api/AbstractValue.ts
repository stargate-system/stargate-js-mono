import {Directions} from "./Directions.js";
import {ValueManifest} from "./ValueManifest";

export abstract class AbstractValue<T> {
    private static nextId = 1;
    protected static applyFromManifest(manifest: ValueManifest, target: AbstractValue<any>) {
        target.valueName = manifest.valueName;
        target.direction = manifest.direction;
    };

    private readonly _id: string;
    private _value: T | undefined;
    protected _type: string | undefined;
    valueName: string | undefined;
    direction: Directions | undefined;
    onLocalUpdate: ((value: AbstractValue<T>) => void) | undefined;
    onRemoteUpdate: ((value: AbstractValue<T>) => void) | undefined;

    protected constructor(id?: string) {
        if (id !== undefined) {
            this._id = id;
        } else {
            const generatedId = AbstractValue.nextId++;
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

    protected _isValueChanged = (newValue: T | undefined): boolean => {
        return this._value !== newValue;
    }

    protected _setLocalValue = (value: T | undefined) => {
        if (this._isValueChanged(value)) {
            this._value = value;
            if (this.onLocalUpdate) {
                this.onLocalUpdate(this);
            }
        }
    }

    setValue = (value: T | undefined) => {
        this._setLocalValue(value);
    }

    protected _setRemoteValue = (value: T | undefined) => {
        if (this._isValueChanged(value)) {
            if (this.direction === Directions.input) {
                this.setValue(value);
            } else {
                this._value = value;
            }
            if (this.onRemoteUpdate) {
                this.onRemoteUpdate(this);
            }
        }
    }

    abstract toString(): string;

    abstract fromRemote(textValue: string): void;

    protected _getBasicManifest = (): ValueManifest => {
        const manifest: ValueManifest = {
            id: this._id,
        }
        if (this._type !== undefined) {
            // @ts-ignore
            manifest.type = this._type;
        }
        if (this.valueName !== undefined) {
            // @ts-ignore
            manifest.valueName = this.valueName;
        }
        if (this.direction !== undefined) {
            // @ts-ignore
            manifest.direction = this.direction;
        }
        return manifest;
    }

    abstract toManifest(): ValueManifest
}