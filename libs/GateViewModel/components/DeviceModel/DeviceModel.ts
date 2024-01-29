import {EventName, ValidManifest} from "gate-core";
import {ModelValue} from "../ModelValue";
import {DeviceState} from "./DeviceState";
import {ModelMap} from "../ModelMap/ModelMap";
import {GateValueModel} from "../GateValueModel/GateValueModel";
import {SystemConnector} from "../../api/SystemConnector";

export class DeviceModel {
    private readonly _id: string;
    private readonly _state: ModelValue<DeviceState>;
    private readonly _gateValues: ModelMap<GateValueModel>;
    private readonly _name: ModelValue<string>;
    private readonly _group: ModelValue<string | undefined>;
    private readonly _systemConnector: SystemConnector;
    private readonly _manifest: ValidManifest;

    constructor(systemConnector: SystemConnector, manifest: ValidManifest, isConnected: boolean) {
        this._systemConnector = systemConnector;
        this._id = manifest.id;
        this._manifest = manifest;
        this._state = new ModelValue<DeviceState>(isConnected ? DeviceState.up : DeviceState.down);
        this._gateValues = new ModelMap<GateValueModel>();
        manifest.values.forEach((valueManifest) => {
            try {
                const gateValueModel = new GateValueModel(
                    manifest.id,
                    valueManifest,
                    this._state.value ?? DeviceState.down,
                    systemConnector);

                this._gateValues.add(gateValueModel.gateValue.id, gateValueModel);
            } catch (err) {
                console.log(err);
            }
        });
        this._name = new ModelValue<string>(manifest.deviceName ?? '');
        this._group = new ModelValue<string | undefined>(manifest.group);
        this._state.subscribe(() => {
            this._gateValues.values.forEach((value) => {
                value.state.setValue(this._state.value ?? DeviceState.down);
            })
        })
    }

    remove = () => {
        this._systemConnector.sendDeviceEvent(EventName.deviceRemoved, [this._id]);
    }

    rename = (newName: string) => {
        this.name.setValue(newName);
        this._systemConnector.sendDeviceEvent(EventName.deviceRenamed, [this._id, newName]);
    };

    addToGroup = (groupName: string) => {
        this._group.setValue(groupName);
        this._systemConnector.sendDeviceEvent(EventName.addedToGroup, [groupName, this._id]);
    }

    modify = (modifiedManifest: ValidManifest) => {
        this._systemConnector.sendDeviceEvent(EventName.deviceModified, [JSON.stringify(modifiedManifest)]);
    }

    get id(): string {
        return this._id;
    }

    get state() {
        return this._state;
    }

    get gateValues(): ModelMap<GateValueModel> {
        return this._gateValues;
    }

    get name(): ModelValue<string>{
        return this._name;
    }

    get group(): ModelValue<string | undefined> {
        return this._group;
    }

    get manifest(): ValidManifest {
        return JSON.parse(JSON.stringify(this._manifest));
    }
}