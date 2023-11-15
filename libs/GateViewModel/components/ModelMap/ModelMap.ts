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

    add = (key: string, value: T) => {
        this._map.set(key, value);
        this._notify((callback) => callback({name: MapEventName.added, id: key}));
    }

    remove = (key: string) => {
        this._map.delete(key);
        this._notify((callback) => callback({name: MapEventName.removed, id: key}));
    }
}