import {GateValue} from "./GateValue.js";
import ValueTypes from "./ValueTypes.js";

export class GateBoolean extends GateValue {
    constructor(valueName, id) {
        super(valueName, id);
        super.value = false;
    }

    get value() {
        return super.value;
    }

    set value(value) {
        super.value = !!value;
    }

    toManifest() {
        const manifest = super.toManifest();
        manifest.type = ValueTypes.boolean;
        return manifest;
    }

    toString() {
        return super.value ? '1' : '0';
    }

    fromString(textValue) {
        this.value = !(textValue === '0');
    }
}