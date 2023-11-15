import {ConnectionType} from "../constants/ConnectionType.js";

const config = {
  logger: {
    remoteLoggingEnabled: true,
    consoleLoggingEnabled: true
  },
  connectionType: ConnectionType.serverless,
  outputBufferDelay: 0,
  queryTimeout: 0,
  handShakeTimeout: 5000
}

export default config;