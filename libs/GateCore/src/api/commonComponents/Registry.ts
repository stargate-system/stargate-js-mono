export class Registry<T> {
    private readonly registry = new Map<string, T>();
    private generatedKey = 0;

    private generateKey(): string {
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
        if (this.registry.has(usedKey)) {
            throw new Error('Key already in use');
        }
        this.registry.set(usedKey, value);
        return usedKey;
    }

    remove(key: string) {
        this.registry.delete(key);
    }

    getByKey(key: string): T | undefined {
        return this.registry.get(key);
    }

    getValues(): Array<T> {
        return [...this.registry.values()];
    }

    isEmpty(): boolean {
        return !this.registry.size;
    }
}