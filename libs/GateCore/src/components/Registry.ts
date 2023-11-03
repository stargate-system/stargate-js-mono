export class Registry<T> {
    private registry: Object = {};
    private generatedKey = 0;

    generateKey(): string {
        const generated = this.generatedKey++;
        return generated.toString();
    }

    add(value: T, key?: string): string {
        let usedKey: string;
        if (key !== undefined) {
            usedKey = key;
        } else {
            usedKey = this.generateKey();
        }
        // @ts-ignore
        if (this.registry[usedKey] !== undefined) {
            throw new Error('Key already in use');
        }
        // @ts-ignore
        this.registry[usedKey] = value;
        return usedKey;
    }

    remove(key: string) {
        this.registry = Object.fromEntries(
            Object.entries(this.registry)
                .filter((entry) => entry[0] !== key)
        );
    }

    getByKey(key: string): T {
        // @ts-ignore
        return this.registry[key];
    }

    getValues(): Array<T> {
        return Object.values(this.registry);
    }

    isEmpty() {
        return !Object.keys(this.registry).length;
    }
}