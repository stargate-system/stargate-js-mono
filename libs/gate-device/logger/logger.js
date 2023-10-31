import config from "../config.js";

const logToSelected = (msg) => {
    if (config.logger.remoteLoggingEnabled) {
        // TODO
        // logRemote(msg);
    }
    if (config.logger.consoleLoggingEnabled) {
        console.log(msg);
    }
}

const logInfo = (msg) => {
    logToSelected('INFO: ' + msg);
}

const logWarning = (msg) => {
    logToSelected('WARNING: ' + msg);
}

const logError = (msg) => {
    logToSelected('ERROR: ' + msg);
}

export default {
    logInfo,
    logWarning,
    logError
}