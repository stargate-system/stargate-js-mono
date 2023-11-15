import {ValidManifest} from "gate-router";
import {ModelValue} from "../ModelValue";
import {DeviceState} from "./DeviceState";
import {ModelMap} from "../ModelMap/ModelMap";
import {GateValue} from "gate-core";
import {GateValueModel} from "../GateValueModel/GateValueModel";

export class DeviceModel {
    private readonly _state: ModelValue<DeviceState>;
    private readonly _gateValues: ModelMap<GateValue<any>>;
    private readonly _name?: string;

    constructor(sendValue: (gateValue: GateValue<any>) => void, manifest: ValidManifest, isConnected: boolean) {
        this._state = new ModelValue<DeviceState>(isConnected ? DeviceState.up : DeviceState.down);
        this._gateValues = new ModelMap<GateValue<any>>();
        manifest.values.forEach((valueManifest) => {
            const gateValueModel = new GateValueModel(
                manifest.id,
                valueManifest,
                this._state.value ?? DeviceState.down,
                sendValue);

            this._gateValues.add(gateValueModel.gateValue.id, gateValueModel.gateValue);
        });
        this._name = manifest.deviceName;
    }

    get state() {
        return this._state;
    }

    get gateValues(): ModelMap<GateValue<any>> {
        return this._gateValues;
    }

    get name(): string | undefined{
        return this._name;
    }
}