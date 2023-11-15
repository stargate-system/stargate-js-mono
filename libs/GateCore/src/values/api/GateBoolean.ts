import {GateValue} from "./GateValue.js";
import {ValueTypes} from "./ValueTypes.js";
import {ValueManifest} from "./ValueManifest.js";

export class GateBoolean extends GateValue<boolean> {
    static fromManifest(manifest: ValueManifest): GateBoolean {
        const gateBoolean = new GateBoolean(manifest.id);
        GateBoolean.applyFromManifest(manifest, gateBoolean);
        return gateBoolean;
    }

    constructor(id?: string) {
        super(id);
        this.setValue(false);
        this._type = ValueTypes.boolean;
    }

    toString = () => {
        return super.value ? '1' : '0';
    }

    fromRemote = (textValue: string) => {
        this._setRemoteValue(!(textValue === '0'));
    }

    toManifest(): ValueManifest {
        return this._getBasicManifest();
    }
}