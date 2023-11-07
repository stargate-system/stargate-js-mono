import config from "../config.js";
import {Logger, LogPrefix} from "gate-core";

const logToSelected = (msg: string, prefix: string) => {
    if (config.logger.remoteLoggingEnabled) {
        // TODO
        // logRemote(msg);
    }
    if (config.logger.consoleLoggingEnabled) {
        switch (prefix) {
            case LogPrefix.info:
                console.log(msg);
                break;
            case LogPrefix.warning:
                console.warn(msg);
                break;
            case LogPrefix.error:
                console.error(msg);
                break;
        }
    }
}

const info = (msg: string) => {
    logToSelected(LogPrefix.info + ' ' + msg, LogPrefix.info);
}

const warning = (msg: string) => {
    logToSelected(LogPrefix.warning + ' ' + msg, LogPrefix.warning);
}

const error = (msg: string) => {
    logToSelected(LogPrefix.error + ' ' + msg, LogPrefix.error);
}

const DeviceLogger: Logger = {
    info,
    warning,
    error
}
export default DeviceLogger;
