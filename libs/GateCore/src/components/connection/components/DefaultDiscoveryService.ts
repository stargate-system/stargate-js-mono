import {DiscoveryService, DiscoveryServiceConfig} from "../interfaces/DiscoveryService";
import CoreConfig from "../../../constants/CoreConfig";
import {Registry} from "../../Registry";
import dgram from "dgram";

const addressListeners = new Registry<(keyword: string) => void>();

let discoveryConfig: DiscoveryServiceConfig = {
    discoveryInterval: CoreConfig.discoveryInterval,
    discoveryPort: CoreConfig.discoveryPort
}

const addressMap = new Map<string, {address: string, timeout: NodeJS.Timeout}>();
let discoverySocket: dgram.Socket | undefined = undefined;

const setConfig = (config: DiscoveryServiceConfig) => {
    discoveryConfig = {
        discoveryInterval: config.discoveryInterval ?? discoveryConfig.discoveryInterval,
        discoveryPort: config.discoveryPort ?? discoveryConfig.discoveryPort
    };
}

const start = () => {
    if (!discoverySocket) {
        discoverySocket = dgram.createSocket('udp4');

        discoverySocket.on('message', (data, remote) => {
            const message = data.toString();
            if (message.match(/^.+:[0-9]+$/)) {
                const [keyword, port] = message.split(':');
                const newServerAddress = remote.address + ':' + port;
                const storedAddress = addressMap.get(keyword);
                const notifyListeners = storedAddress?.address !== newServerAddress;

                if (!storedAddress) {
                    addressMap.set(keyword, {
                        address: newServerAddress,
                        timeout: setTimeout(() => {
                            addressMap.delete(keyword);
                            addressListeners.getValues().forEach((callback) => callback(keyword));
                        }, 2 * discoveryConfig.discoveryInterval)
                    });
                } else {
                    storedAddress.address = newServerAddress;
                    clearTimeout(storedAddress.timeout);
                    storedAddress.timeout = setTimeout(() => {
                        addressMap.delete(keyword);
                        addressListeners.getValues().forEach((callback) => callback(keyword));
                    }, 2 * discoveryConfig.discoveryInterval);
                }
                if (notifyListeners) {
                    addressListeners.getValues().forEach((callback) => callback(keyword));
                }
            }
        });

        discoverySocket.on('error', () => {
            console.log('Discovery socket failed. Retrying...');
            stop();
            setTimeout(start, discoveryConfig.discoveryInterval);
        });
        discoverySocket.bind(discoveryConfig.discoveryPort);
    }
}

const stop = () => {
    if (discoverySocket) {
        discoverySocket.close();
        discoverySocket = undefined;
    }
    addressMap.forEach((address) => clearTimeout(address.timeout));
    addressMap.clear();
}

const addServerAddressChangeListener = (callback: (keyword: string) => void) => {
    if (addressListeners.isEmpty()) {
        start();
    }
    return addressListeners.add(callback);
}

const removeServerAddressChangeListener = (key: string) => {
    addressListeners.remove(key);
    if (addressListeners.isEmpty()) {
        stop();
    }
}

const getServerAddress = (keyword: string) => {
    return addressMap.get(keyword)?.address;
}

const DefaultDiscoveryService: DiscoveryService = {
    addServerAddressChangeListener,
    removeServerAddressChangeListener,
    getServerAddress,
    setConfig
}

export default DefaultDiscoveryService;
