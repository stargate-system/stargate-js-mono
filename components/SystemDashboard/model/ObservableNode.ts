import {Registry} from "gate-core";

export abstract class ObservableNode {
    private readonly _subscribers: Registry<() => void> = new Registry<() => void>();

    protected readonly _notify = () => {
        this._subscribers.getValues().forEach((callback) => callback());
    }

    subscribe = (callback: () => void): string => {
        return this._subscribers.add(callback);
    }

    unsubscribe = (key: string) => {
        this._subscribers.remove(key);
    }
}