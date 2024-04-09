import express from 'express';
import config from "../config";
import {DefaultDiscoveryService} from '@stargate-system/discovery';

const HUB_DISCOVERY_PORT = process.env.HUB_DISCOVERY_PORT ? Number.parseInt(process.env.HUB_DISCOVERY_PORT) : config.hubDiscoveryPort;
const DISCOVERY_KEYWORD = process.env.DISCOVERY_KEYWORD ?? config.discoveryKeyword;
const DISCOVERY_INTERVAL = process.env.DISCOVERY_INTERVAL ? Number.parseInt(process.env.DISCOVERY_INTERVAL) : config.discoveryInterval;
const DISCOVERY_PORT = process.env.DISCOVERY_PORT ? Number.parseInt(process.env.DISCOVERY_PORT) : config.discoveryPort;
const USE_FIXED_URL = process.env.USE_FIXED_URL ? process.env.USE_FIXED_URL.toLowerCase() === 'true' : config.useFixedUrl;
const FIXED_URL = process.env.FIXED_URL ? process.env.FIXED_URL : config.fixedUrl;

let isInitialized = false;

interface DiscoveryService {
    initialize: () => void,
    getServerAddress: () => string | undefined
}

const initialize = () => {
    if (!isInitialized) {
        isInitialized = true;
        const app = express();
        const port = HUB_DISCOVERY_PORT;
        app.get('/', (req, res) => {
            const serverAddress = DefaultDiscoveryService.getServerAddress(req.query.keyword as string ?? DISCOVERY_KEYWORD);
            if (serverAddress) {
                res.send(serverAddress);
            } else {
                res.sendStatus(204);
            }
        });
        app.listen(port);

        DefaultDiscoveryService.setConfig({
            discoveryPort: DISCOVERY_PORT,
            discoveryInterval: DISCOVERY_INTERVAL
        });

        DefaultDiscoveryService.addServerAddressChangeListener((keyword) => {
            const serverAddress = DefaultDiscoveryService.getServerAddress(keyword);
            if (serverAddress) {
                console.log("Server " + keyword + " detected at " + serverAddress);
            } else {
                console.log("Server " + keyword + " offline");
            }
        });
    }
}

const getServerAddress = () => {
    if (USE_FIXED_URL) {
        return FIXED_URL;
    }
    return DefaultDiscoveryService.getServerAddress(DISCOVERY_KEYWORD);
}

const discoveryService: DiscoveryService = {
    initialize,
    getServerAddress
}

export default discoveryService;
