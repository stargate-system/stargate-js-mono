import {SystemRepository} from "./SystemRepository.js";
import DeviceContext from "../context/deviceContext/DeviceContext";
import ControllerContext from "../context/controllerContext/ControllerContext";


const Router = {
    addDevice: DeviceContext.addDevice,
    addController: ControllerContext.addController,
    systemRepository: {} as SystemRepository
}

export default Router;
