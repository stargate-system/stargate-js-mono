import {Registry, ValueMessage} from "gate-core";
import {ControllerConnector} from "./api/ControllerConnector";
import Router from "../../api/Router";
import DeviceContext from "../deviceContext/DeviceContext";
import {EventName} from "../../api/EventName";
import {Device} from "../deviceContext/api/Device";

const controllerRegistry = new Registry<ControllerConnector>();

const addController = async (controller: ControllerConnector) => {
    controller.id = controllerRegistry.add(controller);
    controller.onDisconnect = () => controllerDisconnected(controller);
    controller.onValueMessage = DeviceContext.handleValueMessage;
    const systemImage = await Router.systemRepository.getSystemImage();
    controller.sendJoinData(systemImage, DeviceContext.getActiveDeviceIds());
}

const controllerDisconnected = (controller: ControllerConnector) => {
    if (controller.id) {
        controllerRegistry.remove(controller.id);
    }
}

const handleDeviceEvent = (eventName: EventName, device: Device) => {
    controllerRegistry.getValues()
        .forEach((controller) => controller.sendDeviceEvent(eventName, device));
}

const handleValueMessage = (valueMessage: ValueMessage) => {
    controllerRegistry.getValues().forEach((controller) => {
        controller.sendValueMessage(valueMessage);
    });
}

const ControllerContext = {
    controllerRegistry,
    addController,
    handleDeviceEvent,
    handleValueMessage
}

export default ControllerContext;
