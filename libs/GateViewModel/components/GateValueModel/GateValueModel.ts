import {
    GateValue,
    GateValueFactory,
    ValueManifest,
    AddressMapper
} from "gate-core";
import {DeviceState} from "../DeviceModel/DeviceState";
import {ModelValue} from "../ModelValue";
import {SystemConnector} from "../../api/SystemConnector";

export class GateValueModel {
    private readonly _id: string;
    private readonly _state: ModelValue<DeviceState>;
    private readonly _gateValue: GateValue<any>;
    private readonly _modelValue: ModelValue<any>;

    constructor(parentId: string, valueManifest: ValueManifest, state: DeviceState, systemConnector: SystemConnector) {
        this._state = new ModelValue<DeviceState>(state);
        const modifiedManifest = {...valueManifest};
        modifiedManifest.id = AddressMapper.appendParentId(parentId, valueManifest.id);
        this._id = modifiedManifest.id;
        try {
            this._gateValue = GateValueFactory.fromManifest(modifiedManifest);
        } catch (err) {
            throw new Error("On creating value from manifest: " + err);
        }
        this._modelValue = new ModelValue(this._gateValue.value);
        this._modelValue.onSubscriptionChange = (subscribed) => {
            subscribed ? systemConnector.subscribe(this._id) : systemConnector.unsubscribe(this._id);
        }
        this._gateValue.onRemoteUpdate = () => {
            this._modelValue.setValue(this._gateValue.value);
        };
        this._gateValue.onLocalUpdate = (wasChanged) => {
            this._modelValue.setValue(this._gateValue.value);
            if (wasChanged) {
                systemConnector.connection.sendGateValue(this._gateValue);
            }
        }
    }

    get state(): ModelValue<DeviceState> {
        return this._state;
    }

    get gateValue(): GateValue<any> {
        return this._gateValue;
    }

    get modelValue(): ModelValue<any> {
        return this._modelValue;
    }

    get id(): string {
        return this._id;
    }
}