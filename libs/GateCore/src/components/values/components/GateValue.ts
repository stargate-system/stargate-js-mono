import {Directions} from "../constants/Directions.js";
import {ValueManifest} from "../interfaces/ValueManifest";

export abstract class GateValue<T> {
    private static nextId = 1;
    protected static applyFromManifest(manifest: ValueManifest, target: GateValue<any>) {
        target.valueName = manifest.valueName;
        target.direction = manifest.direction;
    };

    private readonly _id: string;
    private _value?: T;
    protected _type?: string;
    valueName?: string;
    direction?: Directions;
    onLocalUpdate?: (wasChanged: boolean) => void;
    onRemoteUpdate?: (value?: T) => void;
    private _subscribed: boolean = false;
    onSubscriptionChange?: (subscribed: boolean) => void;

    protected constructor(id?: string) {
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

    get subscribed(): boolean {
        return this._subscribed;
    }

    protected _isValueChanged = (newValue?: T): boolean => {
        return this._value !== newValue;
    }

    protected _setLocalValue = (value?: T) => {
        let wasChanged = false;
        if (this._isValueChanged(value)) {
            this._value = value;
            wasChanged = true;
        }
        if (this.onLocalUpdate) {
            this.onLocalUpdate(wasChanged);
        }
    }

    setValue = (value: T | undefined) => {
        this._setLocalValue(value);
    }

    setSubscribed = (subscribed: boolean) => {
        if (this._subscribed !== subscribed) {
            this._subscribed = subscribed;
            if (this.onSubscriptionChange) {
                this.onSubscriptionChange(subscribed);
            }
        }
    }

    protected _setRemoteValue = (value: T | undefined) => {
        if (this._isValueChanged(value)) {
            this._value = value;
            if (this.onRemoteUpdate) {
                this.onRemoteUpdate(value);
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
            manifest.type = this._type;
        }
        if (this.valueName !== undefined) {
            manifest.valueName = this.valueName;
        }
        if (this.direction !== undefined) {
            manifest.direction = this.direction;
        }
        return manifest;
    }

    abstract toManifest(): ValueManifest
}