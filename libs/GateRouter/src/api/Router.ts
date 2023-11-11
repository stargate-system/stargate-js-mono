import MockSystemRepository from "../MockSystemRepository.js";
import {SystemRepository} from "./SystemRepository.js";
import DeviceContext from "../context/deviceContext/DeviceContext";
import ControllerContext from "../context/controllerContext/ControllerContext";


const Router = {
    addDevice: DeviceContext.addDevice,
    addController: ControllerContext.addController,
    systemRepository: MockSystemRepository as SystemRepository
}

export default Router;
