import {GateValue} from "./GateValue";
import {ValueManifest} from "../interfaces/ValueManifest";
import {ValueTypes} from "../constants/ValueTypes";

export class GateSelect extends GateValue<number> {
    private _values: string[] = [];
    nothingSelectedLabel?: string;

    static fromManifest(manifest: ValueManifest): GateSelect {
        const gateSelect = new GateSelect(manifest.id);
        GateValue.setCommonsFromManifest(manifest, gateSelect);
        // @ts-ignore
        if (manifest.options?.values) {
            // @ts-ignore
            gateSelect.values = manifest.options.values;
        }
        // @ts-ignore
        gateSelect.nothingSelectedLabel = manifest.options?.nothingSelectedLabel;
        return gateSelect;
    }

    constructor(id?: string) {
        super(id);
        this._type = ValueTypes.select;
    }

    get values(): string[] {
        return this._values;
    }

    set values(options: string[]) {
        this._values = options;
        if (this.nothingSelectedLabel !== undefined) {
            this._setLocalValue(undefined);
        } else {
            this._setLocalValue(0);
        }
    }

    getSelectedOption = () => {
        return this.value ? this.values[this.value] : undefined;
    }

    setSelectedOption = (option: string | undefined) => {
        if (option !== undefined) {
            let optionIndex: number | undefined;
            this._values.find((value, index) => {
                if (value === option) {
                    optionIndex = index;
                    return true;
                }
                return false;
            });
            if (optionIndex !== undefined) {
                this.setValue(optionIndex);
            }
        } else {
            this.setValue(undefined);
        }
    }

    setValue = (index: number | undefined) => {
        if (index !== undefined) {
            if (index > -1 && index < this._values.length) {
                this._setLocalValue(index);
            } else {
                console.log('WARNING: attempting to set index out of range on ' + this.valueName);
            }
        } else {
            this._setLocalValue(undefined);
        }
    }

    toString = () => {
        return this.value !== undefined ? this.value.toString() : '';
    }

    fromRemote = (textValue: string) => {
        if (textValue === undefined || textValue.length === 0) {
            this._setRemoteValue(undefined);
        } else {
            const index = Number.parseInt(textValue);
            if (Number.isInteger(index) && index > -1 && index < this._values.length) {
                this._setRemoteValue(index);
            }
        }
    }

    toManifest(): ValueManifest {
        const manifest = this._getBasicManifest();
        manifest.options = {
            values: this._values,
            nothingSelectedLabel: this.nothingSelectedLabel
        }
        return manifest;
    }
}