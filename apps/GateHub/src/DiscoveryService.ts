import express from 'express';
import config from "../config";
import {DefaultDiscoveryService} from 'gate-core';

interface DiscoveryService {
    initialize: () => void,
    getServerAddress: () => string | undefined
}

const initialize = () => {
    const HUB_DISCOVERY_PORT = process.env.HUB_DISCOVERY_PORT ? Number.parseInt(process.env.HUB_DISCOVERY_PORT) : config.hubDiscoveryPort;
    const DISCOVERY_KEYWORD = process.env.DISCOVERY_KEYWORD ?? config.discoveryKeyword;
    const DISCOVERY_INTERVAL = process.env.DISCOVERY_INTERVAL ? Number.parseInt(process.env.DISCOVERY_INTERVAL) : config.discoveryInterval;
    const DISCOVERY_PORT = process.env.DISCOVERY_PORT ? Number.parseInt(process.env.DISCOVERY_PORT) : config.discoveryPort;

    if (!DefaultDiscoveryService.isStarted()) {
        const app = express();
        const port = HUB_DISCOVERY_PORT;
        app.get('/', function(req, res) {
            if (DefaultDiscoveryService.getServerAddress() !== undefined) {
                res.send(DefaultDiscoveryService.getServerAddress());
            } else {
                res.sendStatus(204);
            }
        });
        app.listen(port);

        DefaultDiscoveryService.setConfig({
            discoveryPort: DISCOVERY_PORT,
            discoveryInterval: DISCOVERY_INTERVAL,
            discoveryKeyword: DISCOVERY_KEYWORD
        });

        DefaultDiscoveryService.addServerAddressChangeListener((serverAddress) => {
            if (serverAddress) {
                console.log("Server detected at " + serverAddress);
            } else {
                console.log("Server offline");
            }
        });

        startDiscovery(DISCOVERY_INTERVAL);
    }
}

const startDiscovery = (retryInterval: number) => {
    try {
        DefaultDiscoveryService.start();
    } catch (err) {
        console.log('Discovery socket failed. Retrying...');
        setTimeout(startDiscovery, retryInterval);
    }
}

const getServerAddress = () => {
    return DefaultDiscoveryService.getServerAddress();
}

const discoveryService: DiscoveryService = {
    initialize,
    getServerAddress
}

export default discoveryService;
