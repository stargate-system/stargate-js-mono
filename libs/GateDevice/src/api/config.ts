import {ConnectionType} from "../connection/ConnectionType.js";

const config = {
  connectionType: ConnectionType.localServer,
  outputBufferDelay: 0,
  queryTimeout: 5000,
  handShakeTimeout: 5000,
  usePing: false
}

export default config;