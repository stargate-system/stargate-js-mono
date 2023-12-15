import {Directions, GateValue} from "gate-core";
import {device} from "../api/GateDevice.js";

export class DeviceValue<V> {
    private readonly _gateValue: GateValue<any>;
    private readonly _settings?: Object;
    onLocalUpdate?: (wasChanged: boolean) => void;
    onRemoteUpdate?: (wasChanged: boolean) => void;
    onSubscriptionChange?: (subscribed: boolean) => void;

    constructor(gateValue: GateValue<any>) {
        this._gateValue = gateValue;
        this._settings = Object.freeze(gateValue.toManifest().options);
        device.values.add(gateValue, gateValue.id);
        gateValue.onLocalUpdate = (wasChanged) => {
            if (wasChanged && gateValue.subscribed) {
                device.connection.sendGateValue(gateValue);
            }
            if (this.onLocalUpdate) {
                this.onLocalUpdate(wasChanged);
            }
        };
        gateValue.onRemoteUpdate = (wasChanged) => {
            if (gateValue.direction === Directions.input && wasChanged) {
                device.connection.sendGateValue(gateValue);
            }
            if (this.onRemoteUpdate) {
                this.onRemoteUpdate(wasChanged);
            }
        }
        gateValue.onSubscriptionChange = (subscribed) => {
            if (subscribed) {
                device.connection.sendGateValue(gateValue);
            }
            if (this.onSubscriptionChange) {
                this.onSubscriptionChange(subscribed);
            }
        }
    }

    get value(): V {
        return this._gateValue.value;
    }

    get settings() {
        return this._settings;
    }

    setValue = (value: V) => {
        this._gateValue.setValue(value);
    }
}