import {SystemConnector} from "./SystemConnector";
import {ModelValue} from "../components/ModelValue";
import {AddressMapper, ConnectionState, EventName, ValidManifest, ValueMessage} from "gate-core";
import {ModelMap} from "../components/ModelMap/ModelMap";
import {DeviceModel} from "../components/DeviceModel/DeviceModel";
import {DeviceState} from "../components/DeviceModel/DeviceState";
import {PipeModel} from "../components/PipeModel/PipeModel";

export class SystemModel {
    private readonly _systemConnector: SystemConnector;
    private readonly _state: ModelValue<ConnectionState>;
    private readonly _devices: ModelMap<DeviceModel>;
    private readonly _pipes: ModelMap<PipeModel>

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
        this._pipes = new ModelMap<PipeModel>();
        systemConnector.onJoinEvent = (systemImage, connectedDevices) => {
            systemImage.devices.forEach((manifest) => {
                const isConnected = !!connectedDevices
                    .find((id) => id === manifest.id);
                this._devices.update(manifest.id,
                    new DeviceModel(this._systemConnector, manifest, isConnected));
            });
            systemImage.pipes.forEach((pipe) => {
                const pipeModel = new PipeModel(pipe);
                this._pipes.update(pipeModel.id, pipeModel);
            })
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
                case EventName.pipeCreated:
                    if (args[0] && args[1]) {
                        const pipeModel = new PipeModel(args as [string, string]);
                        this._pipes.update(pipeModel.id, pipeModel);
                    }
                    break;
                case EventName.pipeRemoved:
                    if (args[0] && args[1]) {
                        this._pipes.remove(PipeModel.getPipeId(args as [string, string]));
                    }
                    break;
                case EventName.addedToGroup:
                    if (args.length > 1) {
                        const groupName = args[0].length > 0 ? args[0] : undefined;
                        const deviceIds = args.slice(1);
                        deviceIds.forEach((deviceId) => {
                            const device = this._devices.getById(deviceId);
                            if (device) {
                                device.group.setValue(groupName);
                                this._devices.update(device.id, device);
                            }
                        })
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

    get pipes(): ModelMap<PipeModel> {
        return this._pipes;
    }

    get systemConnector(): SystemConnector {
        return this._systemConnector;
    }

    close = () => {
        this._systemConnector.disconnect();
    }
}