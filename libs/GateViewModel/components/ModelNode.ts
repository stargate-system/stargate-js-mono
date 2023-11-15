import {Registry} from "gate-core";

export abstract class ModelNode<T extends Function> {
    private readonly _subscribers = new Registry<T>();

    protected readonly _notify = (notifyFunction: (callback: T) => void) => {
        this._subscribers.getValues().forEach((callback) => notifyFunction(callback));
    }

    subscribe = (callback: T): string => {
        return this._subscribers.add(callback);
    }

    unsubscribe = (key: string) => {
        this._subscribers.remove(key);
    }
}