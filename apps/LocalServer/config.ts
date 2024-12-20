import {CoreConfig} from '@stargate-system/core';

const config = {
    connectionPort: CoreConfig.connectionPort,
    authenticatedPort: 10003,
    discoveryKeyword: CoreConfig.discoveryKeyword,
    discoveryPort: CoreConfig.discoveryPort,
    discoveryInterval: CoreConfig.discoveryInterval,
    broadcastingPort: 11000,
    enableDiscovery: true,
    enableInternalAccess: true,
    enableExternalAccess: true
}

export default config;
