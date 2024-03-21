import {SystemConnector} from "./SystemConnector";
import {ModelValue} from "../components/ModelValue";
import {AddressMapper, ConnectionState, EventName, ServerStorage, ValidManifest, ValueMessage} from "@stargate-system/core";
import {ModelMap} from "../components/ModelMap/ModelMap";
import {DeviceModel} from "../components/DeviceModel/DeviceModel";
import {DeviceState} from "../components/DeviceModel/DeviceState";
import {PipeModel} from "../components/PipeModel/PipeModel";

export class SystemModel {
    private readonly _systemConnector?: SystemConnector;
    private readonly _state: ModelValue<ConnectionState>;
    private readonly _devices: ModelMap<DeviceModel>;
    private readonly _pipes: ModelMap<PipeModel>;
    readonly serverStorage: ServerStorage;

    constructor(systemConnector?: SystemConnector) {
        if (systemConnector) {
            this._systemConnector = systemConnector;
            this.serverStorage = new ServerStorage(systemConnector.connection);
            this._state = new ModelValue<ConnectionState>(systemConnector.connection.state);
            systemConnector.connection.addStateChangeListener((state) => {
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
                        new DeviceModel(this._systemConnector as SystemConnector, manifest, isConnected));
                });
                systemImage.pipes.forEach((pipe) => {
                    const pipeModel = new PipeModel(pipe);
                    this._pipes.update(pipeModel.id, pipeModel);
                })
            }
            systemConnector.connection.onValueMessage = (valueMessage: ValueMessage) => {
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
            systemConnector.onDeviceEvent = (event: string, args: string[]) => {
                switch (event) {
                    case EventName.deviceConnected:
                        if (args[0]) {
                            try {
                                const manifest: ValidManifest = JSON.parse(args[0]);
                                this._devices.update(manifest.id,
                                    new DeviceModel(this._systemConnector as SystemConnector, manifest, true));
                            } catch (err) {
                                console.log('On device connected', err);
                            }
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
                    case EventName.deviceModified:
                        if (args[0]) {
                            try {
                                const manifest: ValidManifest = JSON.parse(args[0]);
                                const deviceToUpdate = this._devices.getById(manifest.id);
                                if (deviceToUpdate) {
                                    const currentState = deviceToUpdate.state.value === DeviceState.up;
                                    this._devices.update(manifest.id, new DeviceModel(this._systemConnector as SystemConnector, manifest, currentState));
                                }
                            } catch (err) {
                                console.log('On device modified', err);
                            }
                        }
                        break;
                    default:
                        console.log('Unknown device event: ' + event);
                }
            }
            systemConnector.onPipeEvent = (event: string, args: string[]) => {
                switch (event) {
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
                    default:
                        console.log('Unknown pipe event: ' + event);
                }
            }
            systemConnector.joinSystem();
        } else {
            this._state = new ModelValue<ConnectionState>(ConnectionState.closed);
            this._pipes = new ModelMap<PipeModel>();
            this._devices = new ModelMap<DeviceModel>();
            this.serverStorage = {} as ServerStorage;
        }
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

    get systemConnector(): SystemConnector | undefined {
        return this._systemConnector;
    }

    createPipe = (pipe: [string, string]) => {
        if (this._systemConnector) {
            this._systemConnector.sendPipeEvent(EventName.pipeCreated, pipe);
        }
    }

    removePipe = (pipe: PipeModel) => {
        if (this._systemConnector) {
            this._systemConnector.sendPipeEvent(EventName.pipeRemoved, [pipe.source, pipe.target]);
        }
    }

    close = () => {
        if (this._systemConnector) {
            this._systemConnector.disconnect();
        }
    }
}