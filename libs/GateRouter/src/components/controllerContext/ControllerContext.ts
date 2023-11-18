import {Registry, ValueMessage} from "gate-core";
import {ControllerConnector} from "../../api/ControllerConnector";
import Router from "../../api/Router";
import DeviceContext from "../deviceContext/DeviceContext";
import {EventName} from "../../constants/EventName";
import {Device} from "../deviceContext/Device";

const controllerRegistry = new Registry<ControllerConnector>();

const addController = async (controller: ControllerConnector) => {
    controller.id = controllerRegistry.add(controller);
    controller.onDisconnect = () => controllerDisconnected(controller);
    controller.onValueMessage = DeviceContext.forwardValueMessage;
    const systemImage = await Router.systemRepository.getSystemImage();
    controller.sendJoinData(systemImage, DeviceContext.getActiveDeviceIds());
    controller.onSubscribed = (ids) => DeviceContext.forwardSubscribed(ids, controller);
    // @ts-ignore
    controller.onUnsubscribed = (ids) => DeviceContext.forwardUnsubscribed(ids, controller.id);
}

const controllerDisconnected = (controller: ControllerConnector) => {
    if (controller.id) {
        controllerRegistry.remove(controller.id);
    }
}

const forwardDeviceEvent = (eventName: EventName, device: Device) => {
    controllerRegistry.getValues()
        .forEach((controller) => controller.sendDeviceEvent(eventName, device));
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
