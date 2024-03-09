import {ModelMapEvent} from "./ModelMapEvent";
import {MapEventName} from "./MapEventName";
import {ModelNode} from "../ModelNode";

export class ModelMap<T> extends ModelNode<(event: ModelMapEvent) => void>{
    private readonly _map = new Map<string, T>();

    get entries() {
        return this._map.entries();
    }

    get values() {
        return [...this._map.values()];
    }

    getById = (id: string) => {
        return this._map.get(id);
    }

    find = (matcher: (value: T) => boolean) => {
        return this.values.find(matcher);
    }

    forEach = (callback: (value: T) => void) => {
        this.values.forEach(callback);
    }

    add = (key: string, value: T) => {
        this._map.set(key, value);
        this._notify((callback) => callback({name: MapEventName.added, id: key}));
    }

    remove = (key: string) => {
        this._map.delete(key);
        this._notify((callback) => callback({name: MapEventName.removed, id: key}));
    }

    update = (key: string, value: T) => {
        const entity = this._map.get(key);
        if (entity) {
            this._map.set(key, value);
            this._notify((callback) => callback({name: MapEventName.updated, id: key}));
        } else {
            this.add(key, value);
        }
    }
}