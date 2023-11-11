import {SystemImage} from "./SystemImage";
import {DeviceConnector} from "../context/deviceContext/api/DeviceConnector";

export interface SystemRepository {
    getSystemImage: () => Promise<SystemImage>
    createDevice: (device: DeviceConnector) => Promise<void>
}