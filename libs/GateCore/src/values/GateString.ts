import {GateValue} from "./api/GateValue.js";
import {ValueTypes} from "./ValueTypes.js";

export class GateString extends GateValue<string> {
    constructor(id?: string) {
        super(id);
        super.value = '';
    }

    set value(value: string) {
        super.value = value;
    }

    toManifest() {
        const manifest= super.toManifest();
        // @ts-ignore
        manifest.type = ValueTypes.string;
        return manifest;
    }

    toString(): string {
        return super.value ?? '';
    }

    fromRemote(textValue: string) {
        super.remoteValue = textValue;
    }
}