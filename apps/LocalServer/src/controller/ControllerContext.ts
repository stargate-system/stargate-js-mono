import {Registry, ValueMessage} from "gate-core";
import {ControllerConnector} from "./ControllerConnector";
import Router from "../Router";
import DeviceContext from "../device/DeviceContext";
import {EventName} from "gate-core";

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
    controller.onDeviceRemoved = (id: string) => {
        if (DeviceContext.deviceRegistry.getByKey(id)) {
            console.log('Cancelled removing device: device is active');
        } else {
            Router.systemRepository.removeDevice(id);
            DeviceContext.notifyPipes(EventName.deviceRemoved, id);
            controllerRegistry.getValues().forEach((ctrl) => ctrl.sendDeviceEvent(EventName.deviceRemoved, [id]));
        }
    }
    controller.onDeviceRenamed = (id: string, newName: string) => {
        Router.systemRepository.renameDevice(id, newName);
        controllerRegistry.getValues().forEach((ctrl) => ctrl.sendDeviceEvent(EventName.deviceRenamed, [id, newName]));
    }
    controller.onPipeCreated = (pipe: [string, string]) => {
        if (Router.systemRepository.createPipe(pipe)) {
            DeviceContext.addPipe(pipe);
            controllerRegistry.getValues().forEach((ctrl) => ctrl.sendDeviceEvent(EventName.pipeCreated, pipe));
        }
    }
    controller.onPipeRemoved = (pipe: [string, string]) => {
        DeviceContext.removePipe(pipe);
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
