import {Registry, ValueMessage} from "gate-core";
import {ControllerConnector} from "./ControllerConnector";
import Router from "../router/Router";
import DeviceContext from "../device/DeviceContext";
import {EventName} from "../common/EventName";

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
    // @ts-ignore
    controller.onUnsubscribed = (ids) => {
        DeviceContext.forwardUnsubscribed(ids, controller.id);
    };
    controller.onDeviceRemoved = (id: string) => {
        if (DeviceContext.deviceRegistry.getByKey(id)) {
            console.log('Cancelled removing device: device is active');
        } else {
            Router.systemRepository.removeDevice(id);
            controllerRegistry.getValues().forEach((ctrl) => ctrl.sendDeviceEvent(EventName.deviceRemoved, [id]));
        }
    }
    controller.onDeviceRenamed = (id: string, newName: string) => {
        Router.systemRepository.renameDevice(id, newName);
        controllerRegistry.getValues().forEach((ctrl) => ctrl.sendDeviceEvent(EventName.deviceRenamed, [id, newName]));
    }
}

const controllerDisconnected = (controller: ControllerConnector) => {
    if (controller.id) {
        controllerRegistry.remove(controller.id);
        DeviceContext.unsubscribeConsumer(controller.id);
    }
}

const forwardDeviceEvent = (eventName: EventName, data: string[]) => {
    controllerRegistry.getValues()
        .forEach((controller) => controller.sendDeviceEvent(eventName, data));
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
    forwardValueMessage
}

export default ControllerContext;
