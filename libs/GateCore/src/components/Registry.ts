export class Registry<T> {
    private readonly _registry = new Map<string, T>();
    private _generatedKey = 0;

    private _generateKey = (): string => {
        const generated = this._generatedKey++;
        return generated.toString();
    }

    add = (value: T, key?: string): string => {
        let usedKey: string;
        if (key !== undefined) {
            usedKey = key;
        } else {
            usedKey = this._generateKey();
        }
        if (this._registry.has(usedKey)) {
            throw new Error(`Key ${usedKey} already in use`);
        }
        this._registry.set(usedKey, value);
        return usedKey;
    }

    remove = (key: string) => {
        this._registry.delete(key);
    }

    getByKey = (key: string): T | undefined => {
        return this._registry.get(key);
    }

    getValues = (): Array<T> => {
        return [...this._registry.values()];
    }

    isEmpty = (): boolean => {
        return !this._registry.size;
    }

    clear = () => {
        this._registry.clear();
    }
}