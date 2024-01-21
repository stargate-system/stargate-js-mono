import {Connection, DefaultConnection, GateValue, Manifest, Registry} from "gate-core";
import defaultConfig from "../../config";

export class GateDevice {
    private _isStarted = false;
    private _manifest: Manifest | undefined;
    private readonly values = new Registry<GateValue<any>>();
    private readonly deviceConfig;
    readonly connection: Connection;

    constructor(config?: Object) {
        this.deviceConfig = config ? {...defaultConfig, ...config} : defaultConfig;
        this.connection = new DefaultConnection(true, this.deviceConfig);
    }
}