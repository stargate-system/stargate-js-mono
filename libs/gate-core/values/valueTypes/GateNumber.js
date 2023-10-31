import { GateValue } from "./GateValue.js";
import ValueTypes from "./ValueTypes.js";

export class GateNumber extends GateValue {
    #range = [];

    constructor(valueName, id) {
        super(valueName, id);
        super.value = 0;
    }

    get value() {
        return super.value;
    }

    set value(value) {
        if (typeof value === 'number') {
            if (this.#range[0] && value < this.#range[0]) {
                super.value = this.#range[0];
            } else if (this.#range[1] && value > this.#range[1]) {
                super.value = this.#range[1];
            } else {
                super.value = value;
            }
        } else {
            throw new Error('Attempting to set non-numeric value: ' + value);
        }
    }

    setMinimum(minimum) {
        if (!super.initialized && typeof minimum === 'number') {
            this.#range[0] = minimum;
            if (super.value < minimum) {
                super.value = minimum;
            }
        }
    }
    setMaximum(maximum) {
        if (!super.initialized && typeof maximum === 'number') {
            this.#range[1] = maximum;
            if (super.value > maximum) {
                super.value = maximum;
            }
        }
    }

    toManifest() {
        const manifest = super.toManifest();
        manifest.type = ValueTypes.number;
        if (this.#range.length) {
            manifest.settings = {
                range: this.#range
            }
        }
        return manifest;
    }

    fromString(textValue) {
        this.value = Number.parseFloat(textValue);
    }

    applySettings(settings) {
        if (settings.range) {
            this.#range = settings.range;
        }
    }
}