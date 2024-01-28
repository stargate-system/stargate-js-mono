import {Device} from "./Device";
import {AddressMapper, EventName, ValueMessage, ValueTypes} from "gate-core";
import {ValueMessageConsumer} from "../common/ValueMessageConsumer";
import Router from "../Router";
import DeviceContext from "./DeviceContext";
import ControllerContext from "../controller/ControllerContext";

export class Pipe implements ValueMessageConsumer{
    private readonly _id: string
    private readonly pipe: [string, string];
    private readonly sourceDeviceId: string;
    private readonly sourceValueId: string;
    private readonly targetDeviceId: string;
    private readonly targetValueId: string;
    private sourceDevice?: Device;
    private targetDevice?: Device;

    constructor(sourceId: string, targetId: string) {
        this._id = sourceId + targetId;
        this.pipe = [sourceId, targetId];
        const [sourceDeviceId, sourceValueId] = AddressMapper.extractTargetId(sourceId);
        this.sourceDeviceId = sourceDeviceId;
        this.sourceValueId = sourceValueId;
        const [targetDeviceId, targetValueId] = AddressMapper.extractTargetId(targetId);
        this.targetDeviceId = targetDeviceId;
        this.targetValueId = targetValueId;
        DeviceContext.deviceRegistry.getValues().forEach((device) => {
            if (device.id === this.sourceDeviceId) {
                this.sourceDevice = device;
            } else if (device.id === this.targetDeviceId) {
                this.targetDevice = device;
            }
        });
        setTimeout(this.activatePipe, 0);
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
                    this.activatePipe();
                }
                break;
            case EventName.deviceDisconnected:
                const disconnectedId = device as string;
                const wasSubscribed = !!this.sourceDevice && !!this.targetDevice;
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
                    DeviceContext.removePipe(this.pipe);
                }
                break;
        }
    }

    sendValueMessage = (valueMessage: ValueMessage) => {
        if (this.targetDevice) {
            this.targetDevice.sendValue([this.targetValueId, valueMessage[0][1]])
        }
    }

    remove = () => {
        if (this.sourceDevice && this.targetDevice) {
            this.sourceDevice.unsubscribe(this.sourceValueId, this._id);
        }
        Router.systemRepository.removePipe(this.pipe);
        ControllerContext.forwardPipeEvent(EventName.pipeRemoved, this.pipe);
    }

    private areTypesCompatible = (type1: string, type2: string) => {
        if (type1 === type2) {
            return true;
        }
        if (type1 === ValueTypes.integer || type1 === ValueTypes.float) {
            return type2 === ValueTypes.integer || type2 === ValueTypes.float
        }
        return false;
    }

    private activatePipe = () => {
        if (this.sourceDevice && this.targetDevice) {
            const sourceValueType = this.sourceDevice.manifest.values
                .find((value) => value.id === this.sourceValueId)?.type;
            const targetValueType = this.targetDevice.manifest.values
                .find((value) => value.id === this.targetValueId)?.type;
            if (sourceValueType && targetValueType && this.areTypesCompatible(sourceValueType, targetValueType)) {
                this.sourceDevice.subscribe(this.sourceValueId, this);
            } else {
                console.log('Dropping pipe ' + this.pipe[0] + ' -> ' + this.pipe[1] + ' - values incompatible');
                DeviceContext.removePipe(this.pipe);
            }
        }
    }
}