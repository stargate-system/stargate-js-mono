import {GateValue} from "./GateValue.js";
import {ValueTypes} from "./ValueTypes.js";
import {ValueManifest} from "./ValueManifest.js";

export class GateNumber extends GateValue<number> {
    private readonly _range: [number | undefined, number | undefined] = [undefined, undefined];
    static fromManifest(manifest: ValueManifest): GateNumber {
        const gateNumber = new GateNumber(manifest.type as ValueTypes.integer | ValueTypes.float, manifest.id);
        GateNumber.applyFromManifest(manifest, gateNumber);
        // @ts-ignore
        if (manifest.options?.range) {
            // @ts-ignore
            gateNumber.setRange(manifest.options.range);
        }

        return gateNumber;
    }

    constructor(type: ValueTypes.integer | ValueTypes.float, id?: string) {
        super(id);
        this.setValue(0);
        this._type = type
    }

    private _getWithinRange = (value: number): number => {
        if ((typeof this._range[0] === "number") && (value < this._range[0])) {
            return this._range[0];
        }
        if ((typeof this._range[1] === "number") && (value > this._range[1])) {
            return this._range[1];
        }
        return value;
    }

    get minimum(): number | undefined {
        return this._range[0];
    }

    get maximum(): number | undefined {
        return this._range[1];
    }

    get range(): [number | undefined, number | undefined] {
        return this._range;
    }

    setValue = (value: number | undefined) => {
        if (value !== undefined) {
            let checkedValue = value;
            if (this._type === ValueTypes.integer) {
                checkedValue = Number.isInteger(value) ? value : Math.round(value);
            }
            this._setLocalValue(this._getWithinRange(checkedValue));
        }
    }

    setMinimum(minimum: number | undefined) {
        this._range[0] = minimum;
        if ((minimum !== undefined) && (this.value !== undefined) && (this.value < minimum)) {
            this.setValue(minimum);
        }
    }
    setMaximum(maximum: number | undefined) {
        this._range[1] = maximum;
        if ((maximum !== undefined) && (super.value !== undefined) && (super.value > maximum)) {
            super.setValue(maximum);
        }
    }

    setRange(range: [number | undefined, number | undefined]) {
        this.setMinimum(range[0]);
        this.setMaximum(range[1]);
    }

    toManifest() {
        const manifest = this._getBasicManifest();
        if (this._range.length) {
            // @ts-ignore
            manifest.options = {
                range: this._range
            }
        }
        return manifest;
    }

    toString = (): string => {
        return this.value !== undefined ? this.value.toString() : '0';
    }

    fromRemote = (textValue: string) => {
        const checkedValue = this._type === ValueTypes.integer ? Number.parseInt(textValue) : Number.parseFloat(textValue);
        if (!Number.isNaN(checkedValue)) {
            this._setRemoteValue(this._getWithinRange(checkedValue));
        }
    }
}