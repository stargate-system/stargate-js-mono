import {SystemConnector} from "./SystemConnector";
import {ModelValue} from "../components/ModelValue";
import {
    ConnectionState,
    ValueMessage,
    EventName,
    AddressMapper,
    ValidManifest
} from "gate-core";
import {ModelMap} from "../components/ModelMap/ModelMap";
import {DeviceModel} from "../components/DeviceModel/DeviceModel";
import {DeviceState} from "../components/DeviceModel/DeviceState";

export class SystemModel {
    private readonly _systemConnector: SystemConnector;
    private readonly _state: ModelValue<ConnectionState>;
    private readonly _devices: ModelMap<DeviceModel>;

    constructor(systemConnector: SystemConnector) {
        this._systemConnector = systemConnector;
        this._state = new ModelValue<ConnectionState>(systemConnector.state);
        systemConnector.addStateChangeListener((state) => {
            this._state.setValue(state);
            if (state !== ConnectionState.ready) {
                this._devices.values.forEach((device) => device.state.setValue(DeviceState.down));
            }
        });
        this._devices = new ModelMap<DeviceModel>();
        systemConnector.onJoinEvent = (systemImage, connectedDevices) => {
            systemImage.devices.forEach((manifest) => {
                const isConnected = !!connectedDevices
                    .filter((id) => id === manifest.id).length;
                this._devices.update(manifest.id,
                    new DeviceModel(this._systemConnector, manifest, isConnected));
            });
        }
        systemConnector.onValueMessage = (valueMessage: ValueMessage) => {
            valueMessage.forEach((change) => {
                const deviceId = AddressMapper.extractTargetId(change[0])[0];
                const device = this._devices.getById(deviceId);
                if (device) {
                    const gateValueModel = device.gateValues.getById(change[0]);
                    if (gateValueModel) {
                        gateValueModel.gateValue.fromRemote(change[1]);
                    }
                }
            });
        }
        systemConnector.onDeviceEvent = (event: EventName, args: string[]) => {
            switch (event) {
                case EventName.deviceConnected:
                    if (args[0]) {
                        const manifest = JSON.parse(args[0]) as ValidManifest;
                        this._devices.update(manifest.id,
                            new DeviceModel(this._systemConnector, manifest, true));
                    }
                    break;
                case EventName.deviceDisconnected:
                    if (args[0]) {
                        const deviceId = args[0];
                        const device = this._devices.getById(deviceId);
                        if (device) {
                            device.state.setValue(DeviceState.down);
                        }
                    }
                    break;
                case EventName.deviceRemoved:
                    if (args[0]) {
                        const deviceId = args[0];
                        this._devices.remove(deviceId);
                    }
                    break;
                case EventName.deviceRenamed:
                    if (args[0] && args[1]) {
                        const deviceId = args[0];
                        const device = this._devices.getById(deviceId);
                        if (device) {
                            device.name.setValue(args[1]);
                        }
                    }
                    break;
            }
        }
        systemConnector.joinSystem();
    }


    get state(): ModelValue<ConnectionState> {
        return this._state;
    }

    get devices(): ModelMap<DeviceModel> {
        return this._devices;
    }
}