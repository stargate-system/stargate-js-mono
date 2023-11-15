import {GateValue} from "./GateValue.js";
import {ValueTypes} from "./ValueTypes.js";
import {ValueManifest} from "./ValueManifest.js";

export class GateString extends GateValue<string> {
    static fromManifest(manifest: ValueManifest): GateString {
        const gateString = new GateString(manifest.id);
        GateString.applyFromManifest(manifest, gateString);
        return gateString;
    }

    constructor(id?: string) {
        super(id);
        this.setValue('');
        this._type = ValueTypes.string;
    }

    toString = (): string => {
        return super.value ?? '';
    }

    fromRemote = (textValue: string) => {
        this._setRemoteValue(textValue);
    }

    toManifest(): ValueManifest {
        return this._getBasicManifest();
    }
}