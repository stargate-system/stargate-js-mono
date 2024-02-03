import {GateValue} from "./GateValue.js";
import {ValueTypes} from "../constants/ValueTypes.js";
import {ValueManifest} from "../interfaces/ValueManifest.js";

export class GateBoolean extends GateValue<boolean> {
    labelTrue?: string;
    labelFalse?: string;
    isButton?: boolean;

    static fromManifest(manifest: ValueManifest): GateBoolean {
        const gateBoolean = new GateBoolean(manifest.id);
        GateValue.setCommonsFromManifest(manifest, gateBoolean);
        // @ts-ignore
        gateBoolean.labelTrue = manifest.options?.labelTrue;
        // @ts-ignore
        gateBoolean.labelFalse = manifest.options?.labelFalse;
        // @ts-ignore
        gateBoolean.isButton = manifest.options?.isButton;
        return gateBoolean;
    }

    constructor(id?: string) {
        super(id);
        this.setValue(false);
        this._type = ValueTypes.boolean;
    }

    toString = () => {
        return this.value ? '1' : '0';
    }

    fromRemote = (textValue: string) => {
        this._setRemoteValue(!(textValue === '0'));
    }

    toManifest(): ValueManifest {
        const manifest = this._getBasicManifest();
        manifest.options = {
            labelTrue: this.labelTrue,
            labelFalse: this.labelFalse,
            isButton: this.isButton
        }
        return manifest;
    }
}