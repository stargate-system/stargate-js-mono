import {SystemRepository} from "../interfaces/SystemRepository.js";
import DeviceContext from "../components/deviceContext/DeviceContext";
import ControllerContext from "../components/controllerContext/ControllerContext";

const Router = {
    addDevice: DeviceContext.addDevice,
    addController: ControllerContext.addController,
    systemRepository: {} as SystemRepository
}

export default Router;
