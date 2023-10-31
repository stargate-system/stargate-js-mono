import {GateValue} from "./GateValue.js";
import ValueTypes from "./ValueTypes.js";

export class GateString extends GateValue {
    constructor(valueName, id) {
        super(valueName, id);
        super.value = "";
    }

    get value() {
        return super.value;
    }

    set value(value) {
        super.value = value;
    }

    toManifest() {
        const manifest= super.toManifest();
        manifest.type = ValueTypes.string;
        return manifest;
    }
}