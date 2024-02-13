import {SystemRepository} from "./persistence/SystemRepository";
import DeviceContext from "./device/DeviceContext";
import ControllerContext from "./controller/ControllerContext";
import BasicServerStorage from "./persistence/BasicServerStorage";
import {ServerStorage} from "./persistence/ServerStorage";

const Router = {
    addDevice: DeviceContext.addDevice,
    addController: ControllerContext.addController,
    systemRepository: {} as SystemRepository,
    serverStorage: BasicServerStorage as ServerStorage
}

export default Router;
