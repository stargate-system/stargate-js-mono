import {GateValue} from "./api/GateValue.js";
import {ValueTypes} from "./ValueTypes.js";

export class GateNumber extends GateValue<number> {
    private readonly _range: [number | undefined, number | undefined] = [undefined, undefined];
    private readonly _type: ValueTypes;

    constructor(type: ValueTypes.integer | ValueTypes.float, id?: string) {
        super(id);
        super.value = 0;
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

    setValue(value: number) {
        let checkedValue = value;
        if (this._type === ValueTypes.integer) {
            checkedValue = Number.isInteger(value) ? value : Math.round(value);
        }
        super.value = this.getWithinRange(checkedValue);
    }

    setMinimum(minimum: number | undefined) {
        this._range[0] = minimum;
        if ((minimum !== undefined) && (super.value !== undefined) && (super.value < minimum)) {
            super.value = minimum;
        }
    }
    setMaximum(maximum: number | undefined) {
        this._range[1] = maximum;
        if ((maximum !== undefined) && (super.value !== undefined) && (super.value > maximum)) {
            super.value = maximum;
        }
    }

    setRange(range: [number | undefined, number | undefined]) {
        this.setMinimum(range[0]);
        this.setMaximum(range[1]);
    }

    toManifest() {
        const manifest = super.toManifest();
        // @ts-ignore
        manifest.type = ValueTypes.number;
        if (this._range.length) {
            // @ts-ignore
            manifest.settings = {
                range: this._range
            }
        }
        return manifest;
    }

    toString(): string {
        return super.value !== undefined ? super.value.toString() : '';
    }

    fromRemote(textValue: string) {
        const checkedValue = this._type === ValueTypes.integer ? Number.parseInt(textValue) : Number.parseFloat(textValue);
        if (!Number.isNaN(checkedValue)) {
            this.remoteValue = this.getWithinRange(checkedValue);
        }
    }
}