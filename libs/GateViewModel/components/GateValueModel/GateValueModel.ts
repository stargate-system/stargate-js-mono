import {GateBoolean, GateNumber, GateString, GateValue, ValueManifest, ValueTypes} from "gate-core";
import {DeviceState} from "../DeviceModel/DeviceState";
import {ModelValue} from "../ModelValue";
import {Markers} from "gate-router";

export class GateValueModel {
    private readonly _state: ModelValue<DeviceState>;
    private readonly _gateValue: GateValue<any>;
    private readonly _value: ModelValue<any>;

    constructor(parentId: string, valueManifest: ValueManifest, state: DeviceState, sendValue: (gateValue: GateValue<any>) => void) {
        this._state = new ModelValue<DeviceState>(state);
        valueManifest.id = parentId + Markers.addressSeparator + valueManifest.id;
        switch (valueManifest.type) {
            case ValueTypes.boolean:
                this._gateValue = GateBoolean.fromManifest(valueManifest);
                break;
            case ValueTypes.string:
                this._gateValue = GateString.fromManifest(valueManifest);
                break;
            case ValueTypes.float:
            case ValueTypes.integer:
                this._gateValue = GateNumber.fromManifest(valueManifest);
                break;
            default:
                // TODO handle unknown types
                throw new Error('On creating value model: unknown type ' + valueManifest.type);
        }
        this._value = new ModelValue(this._gateValue.value);
        this._gateValue.onRemoteUpdate = () => {
            this._value.setValue(this._gateValue.value);
        };
        this._gateValue.onLocalUpdate = () => {
            this._value.setValue(this._gateValue.value);
            sendValue(this.gateValue);
        }
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
}