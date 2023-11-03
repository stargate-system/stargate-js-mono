import {GateValue} from "./GateValue.js";
import {ValueTypes} from "./ValueTypes.js";

export class GateBoolean extends GateValue<boolean> {
    constructor(id?: string) {
        super(id);
        super.value = false;
    }

    toManifest() {
        const manifest = super.toManifest();
        // @ts-ignore
        manifest.type = ValueTypes.boolean;
        return manifest;
    }

    toString() {
        return super.value ? '1' : '0';
    }

    fromRemote(textValue: string) {
        this.remoteValue = !(textValue === '0');
    }
}