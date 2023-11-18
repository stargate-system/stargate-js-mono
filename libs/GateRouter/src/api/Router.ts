import {SystemRepository} from "../interfaces/SystemRepository.js";
import DeviceContext from "../components/deviceContext/DeviceContext";
import ControllerContext from "../components/controllerContext/ControllerContext";
import Markers from "../constants/Markers";

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
