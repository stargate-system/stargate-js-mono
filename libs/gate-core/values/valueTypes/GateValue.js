import { generateId } from "../helper.js";
export class GateValue {
    #id
    #valueName
    #updated = false;
    #value
    #initialized = false;
    onUpdate

    constructor(valueName, id) {
        if (id !== undefined) {
            this.#id = id;
        } else {
            this.#id = generateId();
        }
        this.#valueName = valueName;
    }

    get initialized() {
        return this.#initialized;
    }

    get valueName() {
        return this.#valueName;
    }
    get id() {
        return this.#id;
    }
    get updated() {
        const updated = this.#updated;
        this.#updated = false;
        return updated;
    }
    get value() {
        return this.#value;
    }

    set value(value) {
        this.#updated = true;
        this.#value = value;
        if (this.initialized) {
            this.onUpdate();
        }
    }

    initialize() {
        if (!this.#initialized) {
            this.#initialized = true;
            this.#updated = false;
        }
    }

    toManifest() {
        const manifest = {
            id: this.#id,
        }
        if (this.#valueName) {
            manifest.name = this.#valueName;
        }
        return manifest;
    }

    toString() {
        return this.#value.toString();
    }

    fromString(textValue) {
        this.value = textValue;
    }
}