import {Directions} from "../constants/Directions.js";
import {ValueManifest} from "../interfaces/ValueManifest";
import {ValueVisibility} from "../constants/ValueVisibility";

export abstract class GateValue<T> {
    private static nextId = 1;
    private readonly _onLocalUpdate: Array<(wasChanged: boolean) => void> = [];
    private readonly _onRemoteUpdate: Array<(wasChanged: boolean) => void> = [];
    private readonly _onSubscriptionChange: Array<(subscribed: boolean) => void> = [];
    protected static setCommonsFromManifest(manifest: ValueManifest, target: GateValue<any>) {
        target.valueName = manifest.valueName;
        target.direction = manifest.direction;
        target.visibility = manifest.visibility;
    };

    valueName?: string;
    direction?: Directions;
    visibility?: string;
    protected _type?: string;
    private _value?: T;
    private _subscribed: boolean = false;
    private readonly _id: string;

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

    get onLocalUpdate() {
        return (wasChanged: boolean) => {
            this._onLocalUpdate.forEach((callback) => {
                callback(wasChanged);
            })
        }
    }

    get onRemoteUpdate() {
        return (wasChanged: boolean) => {
            this._onRemoteUpdate.forEach((callback) => {
                callback(wasChanged);
            })
        }
    }

    get onSubscriptionChange() {
        return (subscribed: boolean) => {
            this._onSubscriptionChange.forEach((callback) => {
                callback(subscribed);
            })
        }
    }

    set onLocalUpdate(callback: (wasChanged: boolean) => void) {
        this._onLocalUpdate.push(callback);
    }

    set onRemoteUpdate(callback: (wasChanged: boolean) => void) {
        this._onRemoteUpdate.push(callback);
    }

    set onSubscriptionChange(callback: (subscribed: boolean) => void) {
        this._onSubscriptionChange.push(callback);
    }

    setValue = (value: T | undefined) => {
        this._setLocalValue(value);
    }

    setSubscribed = (subscribed: boolean) => {
        this._subscribed = subscribed;
        this.onSubscriptionChange(subscribed);
    }

    abstract toString(): string;

    abstract fromRemote(textValue: string): void;

    abstract toManifest(): ValueManifest;

    protected _isValueChanged = (newValue?: T): boolean => {
        return this._value !== newValue;
    }

    protected _setLocalValue = (value?: T) => {
        let wasChanged = false;
        if (this._isValueChanged(value)) {
            this._value = value;
            wasChanged = true;
        }
        this.onLocalUpdate(wasChanged);
    }

    protected _setRemoteValue = (value: T | undefined) => {
        let wasChanged = false;
        if (this._isValueChanged(value)) {
            this._value = value;
            wasChanged = true;
        }
        this.onRemoteUpdate(wasChanged);
    }

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
        if (this.visibility && this.visibility !== ValueVisibility.main) {
            manifest.visibility = this.visibility;
        }
        return manifest;
    }
}