import {ConnectionType} from "../constants/ConnectionType.js";

const config = {
  connectionType: ConnectionType.serverless,
  outputBufferDelay: 0,
  queryTimeout: 5000,
  handShakeTimeout: 5000
}

export default config;