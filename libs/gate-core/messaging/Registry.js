export class Registry {
    #registry = {};
    #generatedKey = 0;

    generateKey() {
        const generated = this.#generatedKey++;
        return generated.toString();
    }

    add(value, key) {
        let usedKey;
        if (key) {
            usedKey = key;
        } else {
            usedKey = this.generateKey();
        }
        if (this.#registry[usedKey] !== undefined) {
            throw new Error('Key already in use');
        }
        this.#registry[usedKey] = value;
        return usedKey;
    }

    remove(key) {
        this.#registry = Object.fromEntries(
            Object.entries(this.#registry)
                .filter((entry) => entry[0] !== key)
        );
    }

    getByKey(key) {
        return this.#registry[key];
    }

    getValues() {
        return Object.values(this.#registry);
    }

    isEmpty() {
        return !Object.keys(this.#registry).length;
    }
}