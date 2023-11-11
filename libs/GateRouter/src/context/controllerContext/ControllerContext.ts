import {Registry, ValueMessage} from "gate-core";
import {ControllerConnector} from "./api/ControllerConnector";
import {EventName} from "../../api/EventName";
import Router from "../../api/Router";
import DeviceContext from "../deviceContext/DeviceContext";

const controllerRegistry = new Registry<ControllerConnector>();

const addController = async (controller: ControllerConnector) => {
    if (controller.id === undefined) {
        controller.id = controllerRegistry.add(controller);
        controller.onDisconnect = () => controllerDisconnected(controller);
        controller.onValueMessage = routeControllerMessage;
        const systemImage = await Router.systemRepository.getSystemImage();
        controller.handleJoined(systemImage, DeviceContext.deviceRegistry.getValues().map((device) => device.id));
        DeviceContext.deviceRegistry.getValues().forEach((device) => {
            controller.handleDeviceEvent(EventName.connected, device);
        });
    }
}

const controllerDisconnected = (controller: ControllerConnector) => {
    if (controller.id) {
        controllerRegistry.remove(controller.id);
    }
}

const routeControllerMessage = (valueMessage: ValueMessage) => {

}

const ControllerContext = {
    controllerRegistry,
    addController
}

export default ControllerContext;
