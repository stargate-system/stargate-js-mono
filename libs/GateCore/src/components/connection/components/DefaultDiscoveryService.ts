import {DiscoveryService, DiscoveryServiceConfig} from "../interfaces/DiscoveryService";
import CoreConfig from "../../../constants/CoreConfig";
import {Registry} from "../../Registry";
import dgram from "dgram";

const addressListeners = new Registry<(serverAddress: string | undefined) => void>();

let discoveryConfig: DiscoveryServiceConfig = {
    discoveryKeyword: CoreConfig.discoveryKeyword,
    discoveryInterval: CoreConfig.discoveryInterval,
    discoveryPort: CoreConfig.discoveryPort
}

let serverAddress: string | undefined = undefined;
let discoveryTimeout: NodeJS.Timeout | undefined = undefined;
let discoverySocket: dgram.Socket | undefined = undefined;

const setConfig = (config: DiscoveryServiceConfig) => {
    discoveryConfig = {
        discoveryKeyword: config.discoveryKeyword ?? discoveryConfig.discoveryKeyword,
        discoveryInterval: config.discoveryInterval ?? discoveryConfig.discoveryInterval,
        discoveryPort: config.discoveryPort ?? discoveryConfig.discoveryPort
    };
}

const start = () => {
    if (!discoverySocket) {
        serverAddress = undefined;
        discoverySocket = dgram.createSocket('udp4');

        discoverySocket.on('message', function (message, remote) {
            const [keyword, port] = message.toString().split(':');
            if (keyword === discoveryConfig.discoveryKeyword) {
                const newServerAddress = remote.address + ':' + port;
                if (serverAddress !== newServerAddress) {
                    serverAddress = newServerAddress;
                    addressListeners.getValues().forEach((callback) => callback(serverAddress));
                }
                if (discoveryTimeout) {
                    clearTimeout(discoveryTimeout);
                }
                discoveryTimeout = setTimeout(() => {
                    serverAddress = undefined;
                    addressListeners.getValues().forEach((callback) => callback(serverAddress));
                }, 2 * discoveryConfig.discoveryInterval);
            }
        });

        discoverySocket.on('error', (err) => {
            throw new Error('Discovery socket error: ' + err);
        });
        discoverySocket.bind(discoveryConfig.discoveryPort);
    }
}

const stop = () => {
    if (discoverySocket) {
        discoverySocket.close();
        discoverySocket = undefined;
    }
    if (discoveryTimeout) {
        clearTimeout(discoveryTimeout);
        discoveryTimeout = undefined;
    }
}

const isStarted = () => {
    return !!discoverySocket;
}

const addServerAddressChangeListener = (callback: (serverAddress: string | undefined) => void) => {
    return addressListeners.add(callback);
}

const removeServerAddressChangeListener = (key: string) => {
    addressListeners.remove(key);
}

const getServerAddress = () => {
    return serverAddress;
}

const DefaultDiscoveryService: DiscoveryService = {
    start,
    stop,
    isStarted,
    addServerAddressChangeListener,
    removeServerAddressChangeListener,
    getServerAddress,
    setConfig
}

export default DefaultDiscoveryService;
