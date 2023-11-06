import {GateValue} from "./api/GateValue.js";
import {ValueTypes} from "./ValueTypes.js";

export class GateNumber extends GateValue<number> {
    private readonly _range: [number | undefined, number | undefined] = [undefined, undefined];

    constructor(type: ValueTypes.integer | ValueTypes.float, id?: string) {
        super(id);
        this.setValue(0);
        this._type = type
    }

    private getWithinRange = (value: number): number => {
        if ((this._range[0] !== undefined) && (value < this._range[0])) {
            return this._range[0];
        }
        if ((this._range[1] !== undefined) && (value > this._range[1])) {
            return this._range[1];
        }
        return value;
    }

    setValue = (value: number | undefined) => {
        if (value !== undefined) {
            let checkedValue = value;
            if (this._type === ValueTypes.integer) {
                checkedValue = Number.isInteger(value) ? value : Math.round(value);
            }
            this._setLocalValue(this.getWithinRange(checkedValue));
        }
    }

    setMinimum(minimum: number | undefined) {
        this._range[0] = minimum;
        if ((minimum !== undefined) && (super.value !== undefined) && (super.value < minimum)) {
            super.setValue(minimum);
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
        const manifest = super.toManifest();
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
            this._setRemoteValue(this.getWithinRange(checkedValue));
        }
    }
}