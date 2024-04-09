import {CoreConfig} from "@stargate-system/core";

const config = {
    hubDiscoveryPort: CoreConfig.hubDiscoveryPort,
    discoveryKeyword: CoreConfig.discoveryKeyword,
    discoveryPort: CoreConfig.discoveryPort,
    discoveryInterval: CoreConfig.discoveryInterval,
    useFixedUrl: false,
    fixedUrl: 'localhost:10002'
}

export default config;