import {CoreConfig} from 'gate-core';

const config = {
    httpPort: 8080,
    connectionPort: CoreConfig.connectionPort,
    discoveryKeyword: CoreConfig.discoveryKeyword,
    discoveryPort: CoreConfig.discoveryPort,
    discoveryInterval: CoreConfig.discoveryInterval,
    broadcastingPort: 11000,
    enableDiscovery: true
}

export default config;
