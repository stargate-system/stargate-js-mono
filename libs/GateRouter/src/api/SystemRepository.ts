import {SystemImage} from "./SystemImage";
import {DeviceConnector} from "./DeviceConnector";

export interface SystemRepository {
    getSystemImage: () => Promise<SystemImage>
    createDevice: (device: DeviceConnector) => Promise<void>
}