import {GateValue} from "./GateValue.js";
import {ValueTypes} from "../constants/ValueTypes.js";
import {ValueManifest} from "../interfaces/ValueManifest.js";

export class GateString extends GateValue<string> {
    static fromManifest(manifest: ValueManifest): GateString {
        const gateString = new GateString(manifest.id);
        GateString.setCommonsFromManifest(manifest, gateString);
        // @ts-ignore
        if (manifest.options?.minimumLength) {
            // @ts-ignore
            gateString.minimumLength = manifest.options.minimumLength;
        }
        return gateString;
    }

    minimumLength?: number;

    constructor(id?: string) {
        super(id);
        this.setValue('');
        this._type = ValueTypes.string;
    }

    toString = (): string => {
        return this.value ?? '';
    }

    fromRemote = (textValue: string) => {
        this._setRemoteValue(textValue);
    }

    toManifest(): ValueManifest {
        const manifest = this._getBasicManifest();
        manifest.options = {
            minimumLength: this.minimumLength
        }
        return manifest;
    }
}