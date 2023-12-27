import {Device} from "./Device";
import {AddressMapper, EventName, ValueMessage} from "gate-core";
import {ValueMessageConsumer} from "../common/ValueMessageConsumer";
import Router from "../Router";
import DeviceContext from "./DeviceContext";
import ControllerContext from "../controller/ControllerContext";

export class Pipe implements ValueMessageConsumer{
    private readonly _id: string
    private readonly sourceDeviceId: string;
    private readonly sourceValueId: string;
    private readonly targetDeviceId: string;
    private readonly targetValueId: string;
    private sourceDevice?: Device;
    private targetDevice?: Device;

    constructor(sourceId: string, targetId: string) {
        this._id = sourceId + targetId;
        const sourceAddress = AddressMapper.extractTargetId(sourceId);
        this.sourceDeviceId = sourceAddress[0];
        this.sourceValueId = sourceAddress[1];
        const targetAddress = AddressMapper.extractTargetId(targetId);
        this.targetDeviceId = targetAddress[0];
        this.targetValueId = targetAddress[1];
        DeviceContext.deviceRegistry.getValues().forEach((device) => {
            if (device.id === this.sourceDeviceId) {
                this.sourceDevice = device;
            } else if (device.id === this.targetDeviceId) {
                this.targetDevice = device;
            }
        });
        if (this.sourceDevice && this.targetDevice) {
            this.sourceDevice.subscribe(this.sourceValueId, this);
        }
    }

    get id() {
        return this._id;
    }

    handleDeviceEvent = (event: string, device: Device | string) => {
        switch (event) {
            case EventName.deviceConnected:
                if (!(this.sourceDevice && this.targetDevice)) {
                    const deviceId = (device as Device).id;
                    if (this.sourceDeviceId === deviceId) {
                        this.sourceDevice = device as Device;
                    } else if (this.targetDeviceId === deviceId) {
                        this.targetDevice = device as Device;
                    }
                    if (this.sourceDevice && this.targetDevice) {
                        this.sourceDevice.subscribe(this.sourceValueId, this);
                    }
                }
                break;
            case EventName.deviceDisconnected:
                const disconnectedId = device as string;
                const wasSubscribed = this.sourceDevice && this.targetDevice;
                if (this.sourceDeviceId === disconnectedId) {
                    this.sourceDevice = undefined;
                } else if (this.targetDeviceId === disconnectedId) {
                    this.targetDevice = undefined;
                    if (wasSubscribed) {
                        this.sourceDevice?.unsubscribe(this.sourceValueId, this._id);
                    }
                }
                break;
            case EventName.deviceRemoved:
                const removedId = device as string;
                if (this.sourceDeviceId === removedId || this.targetDeviceId === removedId) {
                    const pipe: [string, string] = [
                        AddressMapper.appendParentId(this.sourceDeviceId, this.sourceValueId),
                        AddressMapper.appendParentId(this.targetDeviceId, this.targetValueId)
                    ];
                    Router.systemRepository.removePipe(pipe);
                    DeviceContext.removePipe(pipe);
                    ControllerContext.forwardDeviceEvent(EventName.pipeRemoved, pipe);
                }
                break;
        }
    }

    sendValueMessage = (valueMessage: ValueMessage) => {
        if (this.targetDevice) {
            this.targetDevice.sendValue([this.targetValueId, valueMessage[0][1]])
        }
    }
}