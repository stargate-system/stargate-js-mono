import {SystemRepository} from "../persistence/SystemRepository";
import DeviceContext from "../device/DeviceContext";
import ControllerContext from "../controller/ControllerContext";
import Markers from "../common/Markers";

const appendParentId = (parentId: string, id: string) => {
    return parentId + Markers.addressSeparator + id;
}

const extractTargetId = (address: string) => {
    const separatorIndex = address.indexOf(Markers.addressSeparator);
    return [address.substring(0, separatorIndex), address.substring(separatorIndex + 1)];
}

const Router = {
    addDevice: DeviceContext.addDevice,
    addController: ControllerContext.addController,
    appendParentId,
    extractTargetId,
    systemRepository: {} as SystemRepository
}

export default Router;
