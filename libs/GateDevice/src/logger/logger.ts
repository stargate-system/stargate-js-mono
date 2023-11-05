import config from "../../config.js";

// TODO move to core
enum LogType {
    info = 'info',
    warning = 'warning',
    error = 'error'
}

const logToSelected = (msg: string, type: LogType) => {
    if (config.logger.remoteLoggingEnabled) {
        // TODO
        // logRemote(msg);
    }
    if (config.logger.consoleLoggingEnabled) {
        switch (type) {
            case LogType.info:
                console.log(msg);
                break;
            case LogType.warning:
                console.warn(msg);
                break;
            case LogType.error:
                console.error(msg);
                break;
        }
    }
}

const logInfo = (msg: string) => {
    logToSelected('INFO: ' + msg, LogType.info);
}

const logWarning = (msg: string) => {
    logToSelected('WARNING: ' + msg, LogType.warning);
}

const logError = (msg: string) => {
    logToSelected('ERROR: ' + msg, LogType.error);
}

export default {
    logInfo,
    logWarning,
    logError
}