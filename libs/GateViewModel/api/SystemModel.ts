import {SystemConnector} from "./SystemConnector";
import {ModelValue} from "../components/ModelValue";
import {ConnectionState, ValueMessage} from "gate-core";
import {ModelMap} from "../components/ModelMap/ModelMap";
import {DeviceModel} from "../components/DeviceModel/DeviceModel";
import {DeviceState} from "../components/DeviceModel/DeviceState";
import {Markers} from "gate-router";

export class SystemModel {
    private readonly _systemConnector: SystemConnector;
    private readonly _state: ModelValue<ConnectionState>;
    private readonly _devices: ModelMap<DeviceModel>;

    constructor(systemConnector: SystemConnector) {
        this._systemConnector = systemConnector;
        this._state = new ModelValue<ConnectionState>(systemConnector.state);
        systemConnector.onStateChange = (state) => {
            this._state.setValue(state);
            if (state !== ConnectionState.ready) {
                this._devices.values.forEach((device) => device.state.setValue(DeviceState.down));
            }
        };
        this._devices = new ModelMap<DeviceModel>();
        systemConnector.onJoinEvent = (systemImage, connectedDevices) => {
            systemImage.devices.forEach((manifest) => {
                const isConnected = !!connectedDevices
                    .filter((id) => id === manifest.id).length;
                this._devices.add(manifest.id, new DeviceModel(this._systemConnector.sendValue, manifest, isConnected));
            })
        }
        systemConnector.onValueMessage = (valueMessage: ValueMessage) => {
            valueMessage.forEach((change) => {
                const deviceId = change[0].split(Markers.addressSeparator)[0];
                const device = this._devices.getById(deviceId);
                if (device) {
                    const gateValue = device.gateValues.getById(change[0]);
                    if (gateValue) {
                        gateValue.fromRemote(change[1]);
                    }
                }
            });
        }
    }


    get state(): ModelValue<ConnectionState> {
        return this._state;
    }

    get devices(): ModelMap<DeviceModel> {
        return this._devices;
    }
}