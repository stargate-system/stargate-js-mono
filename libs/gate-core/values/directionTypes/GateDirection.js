export class GateDirection {
    #type

    constructor(valueType) {
        this.#type = valueType;
    }

    get id() {
        return this.#type.id;
    }
    get valueName() {
        return this.#type.valueName
    }
    get value() {
        return this.#type.value;
    }

    get type() {
        return this.#type;
    }

    initialize() {
        this.#type.initialize();
    }

    toManifest() {
        return this.#type.toManifest();
    }

    toString() {
        return this.#type.toString();
    }
}