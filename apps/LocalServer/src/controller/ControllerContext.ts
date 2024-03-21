import {EventName, Registry, ValidManifest, ValueMessage} from "@stargate-system/core";
import {ControllerConnector} from "./ControllerConnector";
import Router from "../Router";
import DeviceContext from "../device/DeviceContext";

const controllerRegistry = new Registry<ControllerConnector>();

const addController = async (controller: ControllerConnector) => {
    controller.id = controllerRegistry.add(controller);
    controller.onDisconnect = () => controllerDisconnected(controller);
    controller.onValueMessage = DeviceContext.forwardValueMessage;
    const systemImage = await Router.systemRepository.getSystemImage();
    const activeDeviceIds = DeviceContext.getActiveDeviceIds();
    controller.sendJoinData(systemImage, activeDeviceIds);
    controller.onSubscribed = (ids) => {
        DeviceContext.forwardSubscribed(ids, controller)
    };
    controller.onUnsubscribed = (ids) => {
        DeviceContext.forwardUnsubscribed(ids, controller);
    };
    controller.onDeviceEvent = (event, data) => {
        switch (event) {
            case EventName.deviceRemoved:
                if (data[0]) {
                    const [id] = data;
                    if (DeviceContext.deviceRegistry.getByKey(id)) {
                        console.log('Cancelled removing device: device is active');
                    } else {
                        Router.systemRepository.removeDevice(id);
                        Router.serverStorage.remove(id);
                        DeviceContext.notifyPipes(EventName.deviceRemoved, id);
                        forwardDeviceEvent(EventName.deviceRemoved, [id]);
                    }
                }
                break;
            case EventName.deviceRenamed:
                if (data[0] && data[1]) {
                    const [id, newName] = data;
                    Router.systemRepository.renameDevice(id, newName);
                    forwardDeviceEvent(EventName.deviceRenamed, [id, newName]);
                }
                break;
            case EventName.addedToGroup:
                if (data.length > 1) {
                    const groupName = data[0];
                    const deviceIds = data.slice(1);
                    Router.systemRepository.addDevicesToGroup(groupName, deviceIds);
                    forwardDeviceEvent(EventName.addedToGroup, [groupName ?? '', ...deviceIds]);
                }
                break;
            case EventName.deviceModified:
                if (data[0]) {
                    try {
                        const manifest: ValidManifest = JSON.parse(data[0]);
                        Router.systemRepository.overwriteDevice(manifest).then((success) => {
                            if (success) {
                                forwardDeviceEvent(EventName.deviceModified, data);
                            } else {
                                console.log('Failed to modify device', data);
                            }
                        });
                    } catch (err) {
                        console.log('On device modified', err);
                    }
                }
                break;
            default:
                console.log('Unknown device event: ' + event);
        }
    }
    controller.onPipeEvent = (event, data) => {
        if (data[0] && data[1]) {
            const pipe = data as [string, string];
            switch (event) {
                case EventName.pipeCreated:
                    Router.systemRepository.createPipe(pipe).then((success) => {
                        if (success) {
                            DeviceContext.addPipe(pipe);
                            forwardPipeEvent(EventName.pipeCreated, pipe);
                        } else {
                            console.log('Failed to create pipe', data);
                        }
                    })
                    break;
                case EventName.pipeRemoved:
                    DeviceContext.removePipe(pipe);
                    break;
                default:
                    console.log('Unknown pipe event: ' + event);
            }
        }
    }
    console.log('Connected controller ' + controller.id);
}

const controllerDisconnected = (controller: ControllerConnector) => {
    if (controller.id) {
        controllerRegistry.remove(controller.id);
        DeviceContext.unsubscribeConsumer(controller.id);
        console.log('Disconnected controller ' + controller.id);
    }
}

const forwardDeviceEvent = (eventName: EventName, data: string[]) => {
    controllerRegistry.getValues()
        .forEach((controller) => controller.sendDeviceEvent(eventName, data));
}

const forwardPipeEvent = (eventName: EventName, data: string[]) => {
    controllerRegistry.getValues()
        .forEach((controller) => controller.sendPipeEvent(eventName, data));
}

const forwardValueMessage = (valueMessage: ValueMessage) => {
    controllerRegistry.getValues().forEach((controller) => {
        controller.sendValueMessage(valueMessage);
    });
}

const ControllerContext = {
    controllerRegistry,
    addController,
    forwardDeviceEvent,
    forwardPipeEvent,
    forwardValueMessage
}

export default ControllerContext;
