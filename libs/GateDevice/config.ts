import {CoreConfig} from "gate-core";

const config = {
  discoveryKeyword: CoreConfig.discoveryKeyword,
  discoveryPort: CoreConfig.discoveryPort,
  hubDiscoveryPort: CoreConfig.hubDiscoveryPort,
  discoveryInterval: CoreConfig.discoveryInterval,
  outputBufferDelay: 0,
  queryTimeout: 5000,
  handshakeTimeout: 5000,
  usePing: false
}

export default config;