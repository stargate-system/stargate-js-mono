import {AbstractValue, Registry} from "gate-core";

export class RegisteredValue<T extends AbstractValue<any>> {
    private readonly _subscribers: Registry<() => void> = new Registry<() => void>();
    private readonly _gateValue: T;

    constructor(gateValue: T) {
        this._gateValue = gateValue;
        gateValue.onRemoteUpdate = () => {
            this._subscribers.getValues().forEach((callback) => callback());
        };
    }

    get gateValue(): T {
        return this._gateValue;
    }

    subscribe = (callback: () => void): string => {
        return this._subscribers.add(callback);
    }

    unsubscribe = (key: string) => {
        this._subscribers.remove(key);
    }
}
