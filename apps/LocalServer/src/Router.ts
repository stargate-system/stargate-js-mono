import {SystemRepository} from "./persistence/SystemRepository";
import DeviceContext from "./device/DeviceContext";
import ControllerContext from "./controller/ControllerContext";

const Router = {
    addDevice: DeviceContext.addDevice,
    addController: ControllerContext.addController,
    systemRepository: {} as SystemRepository
}

export default Router;
