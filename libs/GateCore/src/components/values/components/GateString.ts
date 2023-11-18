import {GateValue} from "./GateValue.js";
import {ValueTypes} from "../constants/ValueTypes.js";
import {ValueManifest} from "../interfaces/ValueManifest.js";

export class GateString extends GateValue<string> {
    static fromManifest(manifest: ValueManifest): GateString {
        const gateString = new GateString(manifest.id);
        GateString.setCommonsFromManifest(manifest, gateString);
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