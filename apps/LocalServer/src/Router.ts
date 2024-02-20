import {SystemRepository} from "./persistence/SystemRepository";
import ControllerContext from "./controller/ControllerContext";
import BasicServerStorage from "./persistence/BasicServerStorage";
import {ServerStorage} from "./persistence/ServerStorage";

const Router = {
    addController: ControllerContext.addController,
    systemRepository: {} as SystemRepository,
    serverStorage: BasicServerStorage as ServerStorage
}

export default Router;
