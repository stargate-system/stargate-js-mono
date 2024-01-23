export interface DiscoveryService {
    addServerAddressChangeListener: (callback: (keyword: string) => void) => string,
    removeServerAddressChangeListener: (key: string) => void,
    getServerAddress: (keyword: string) => string | undefined,
    executeWhenServerFound: (keyword: string, callback: (serverAddress: string) => void, hubDiscoveryPort?: number) => void,
    setConfig: (config: DiscoveryServiceConfig) => void
}

export interface DiscoveryServiceConfig {
    discoveryInterval: number,
    discoveryPort: number
}