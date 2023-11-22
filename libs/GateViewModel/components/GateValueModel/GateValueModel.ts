import {GateValue, GateValueFactory, ValueManifest, ValueTypes} from "gate-core";
import {DeviceState} from "../DeviceModel/DeviceState";
import {ModelValue} from "../ModelValue";
import {Router} from "gate-router";
import {SystemConnector} from "../../api/SystemConnector";

export class GateValueModel {
    private readonly _id: string;
    private readonly _state: ModelValue<DeviceState>;
    private readonly _gateValue: GateValue<any>;
    private readonly _value: ModelValue<any>;
    private readonly _name?: string;

    constructor(parentId: string, valueManifest: ValueManifest, state: DeviceState, systemConnector: SystemConnector) {
        this._state = new ModelValue<DeviceState>(state);
        const modifiedManifest = {...valueManifest};
        modifiedManifest.id = Router.appendParentId(parentId, valueManifest.id);
        this._id = modifiedManifest.id;
        this._name = modifiedManifest.valueName;
        this._gateValue = GateValueFactory.fromManifest(modifiedManifest);
        this._value = new ModelValue(this._gateValue.value);
        this._value.onSubscriptionChange = (subscribed) => {
            subscribed ? systemConnector.subscribe(this._id) : systemConnector.unsubscribe(this._id);
        }
        this._gateValue.onRemoteUpdate = () => {
            this._value.setValue(this._gateValue.value);
        };
        this._gateValue.onLocalUpdate = (wasChanged) => {
            this._value.setValue(this._gateValue.value);
            if (wasChanged || this._gateValue.type === ValueTypes.string) {
                systemConnector.sendValue(this._gateValue);
            }
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

    get name(): string | undefined {
        return this._name;
    }

    get id(): string {
        return this._id;
    }
}