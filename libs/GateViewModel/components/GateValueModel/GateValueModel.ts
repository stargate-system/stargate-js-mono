import {GateBoolean, GateNumber, GateString, GateValue, ValueManifest, ValueTypes} from "gate-core";
import {DeviceState} from "../DeviceModel/DeviceState";
import {ModelValue} from "../ModelValue";
import {Markers} from "gate-router";

export class GateValueModel {
    private readonly _id: string;
    private readonly _state: ModelValue<DeviceState>;
    private readonly _gateValue: GateValue<any>;
    private readonly _value: ModelValue<any>;
    private readonly _name?: string;

    constructor(parentId: string, valueManifest: ValueManifest, state: DeviceState, sendValue: (gateValue: GateValue<any>) => void) {
        this._state = new ModelValue<DeviceState>(state);
        const modifiedManifest = {...valueManifest};
        modifiedManifest.id = parentId + Markers.addressSeparator + valueManifest.id;
        switch (modifiedManifest.type) {
            case ValueTypes.boolean:
                this._gateValue = GateBoolean.fromManifest(modifiedManifest);
                break;
            case ValueTypes.string:
                this._gateValue = GateString.fromManifest(modifiedManifest);
                break;
            case ValueTypes.float:
            case ValueTypes.integer:
                this._gateValue = GateNumber.fromManifest(modifiedManifest);
                break;
            default:
                // TODO handle unknown types
                throw new Error('On creating value model: unknown type ' + modifiedManifest.type);
        }
        this._value = new ModelValue(this._gateValue.value);
        this._gateValue.onRemoteUpdate = () => {
            this._value.setValue(this._gateValue.value);
        };
        this._gateValue.onLocalUpdate = (wasChanged) => {
            this._value.setValue(this._gateValue.value);
            if (wasChanged) {
                sendValue(this._gateValue);
            }
        }
        this._name = modifiedManifest.valueName;
        this._id = modifiedManifest.id;
    }

    get state(): ModelValue<DeviceState> {
        return this._state;
    }

    get gateValue(): GateValue<any> {
        return this._gateValue;
    }

    get value(): ModelValue<any> {
        return this._value;
    }

    get name(): string | undefined {
        return this._name;
    }

    get id(): string {
        return this._id;
    }
}