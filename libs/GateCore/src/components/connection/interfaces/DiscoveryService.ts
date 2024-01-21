export interface DiscoveryService {
    addServerAddressChangeListener: (callback: (keyword: string) => void) => string,
    removeServerAddressChangeListener: (key: string) => void,
    getServerAddress: (keyword: string) => string | undefined,
    setConfig: (config: DiscoveryServiceConfig) => void
}

export interface DiscoveryServiceConfig {
    discoveryInterval: number,
    discoveryPort: number
}