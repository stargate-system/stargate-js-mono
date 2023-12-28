import {DeviceConnector} from "./DeviceConnector";
import {Registry, ValueMessage, AddressMapper} from "gate-core";
import {Device} from "./Device";
import {ValueMessageConsumer} from "../common/ValueMessageConsumer";
import {Pipe} from "./Pipe";
import Router from "../Router";

const deviceRegistry = new Registry<Device>();
let pipes: Pipe[] = [];

export const initDeviceContext = async () => {
    const image = await Router.systemRepository.getSystemImage();
    if (image.pipes) {
        pipes = image.pipes.map((pipe) => new Pipe(pipe[0], pipe[1]));
    }
}

const addDevice = async (deviceConnector: DeviceConnector) => {
    try {
        new Device(deviceConnector);
    } catch (err) {
        console.log(err);
    }
}

const forwardValueMessage = (valueMessage: ValueMessage) => {
    valueMessage.forEach((message) => {
        const [deviceId, valueId] = AddressMapper.extractTargetId(message[0]);
        const device = deviceRegistry.getByKey(deviceId);
        if (device) {
            device.sendValue([valueId, message[1]]);
        }
    });
}

const handleSubscription = (subscribe: boolean, ids: string[], source: ValueMessageConsumer) => {
    const devicesMap = new Map<string, string[]>();
    ids.forEach((idWithParent) => {
        const [parentId, valueId] = AddressMapper.extractTargetId(idWithParent);
        let valueIds = devicesMap.get(parentId);
        if (valueIds) {
            valueIds.push(valueId);
        } else {
            devicesMap.set(parentId, [valueId]);
        }
    });
    devicesMap.forEach((valueIds, deviceId) => {
        const targetDevice = deviceRegistry.getByKey(deviceId);
        if (targetDevice) {
            if (subscribe) {
                valueIds.forEach((id) => {
                    targetDevice.subscribe(id, source);
                });
            } else {
                valueIds.forEach((id) => {
                    targetDevice.unsubscribe(id, source.id);
                });
            }
        }
    });
}

const forwardSubscribed = (ids: string[], source: ValueMessageConsumer) => {
    handleSubscription(true, ids, source);
}

const forwardUnsubscribed = (ids: string[], source: ValueMessageConsumer) => {
    handleSubscription(false, ids, source);
}

const getActiveDeviceIds = (): string[] => {
    return deviceRegistry.getValues().map((device) => device.id);
}

const unsubscribeConsumer = (consumerId: string) => {
    deviceRegistry.getValues().forEach((device) => device.unsubscribeConsumer(consumerId));
}

const addPipe = (pipe: [string, string]) => {
    pipes.push(new Pipe(pipe[0], pipe[1]));
}

const removePipe = (pipe: [string, string]) => {
    const removedId = pipe[0] + pipe[1];
    let removedPipe: Pipe | undefined;
    pipes = pipes.filter((storedPipe) => {
        const isRemoved = storedPipe.id === removedId;
        if (isRemoved) {
            removedPipe = storedPipe;
        }
        return !isRemoved;
    });
    if (removedPipe) {
        removedPipe.disconnect();
    }
}

const notifyPipes = (event: string, device: Device | string) => {
    pipes.forEach((pipe) => {
        pipe.handleDeviceEvent(event, device);
    })
}

const DeviceContext = {
    deviceRegistry,
    addDevice,
    forwardValueMessage,
    forwardSubscribed,
    forwardUnsubscribed,
    getActiveDeviceIds,
    unsubscribeConsumer,
    addPipe,
    removePipe,
    notifyPipes
}

export default DeviceContext;
