export interface DiscoveryService {
    start: () => void,
    stop: () => void,
    isStarted: () => boolean,
    addServerAddressChangeListener: (callback: (serverAddress: string | undefined) => void) => string,
    removeServerAddressChangeListener: (key: string) => void,
    getServerAddress: () => string | undefined,
    setConfig: (config: DiscoveryServiceConfig) => void
}

export interface DiscoveryServiceConfig {
    discoveryKeyword: string,
    discoveryInterval: number,
    discoveryPort: number
}