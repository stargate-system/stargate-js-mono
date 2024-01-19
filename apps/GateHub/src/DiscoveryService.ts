import dgram from "dgram";
import express from 'express';
import config from "../config";

let serverAddress: string | undefined;
let discoveryRunning = false;
let discoveryTimeout: NodeJS.Timeout | undefined;

interface DiscoveryService {
    initialize: () => void,
    getServerAddress: () => string | undefined
}

const initialize = () => {
    const HUB_DISCOVERY_PORT = process.env.HUB_DISCOVERY_PORT ? Number.parseInt(process.env.HUB_DISCOVERY_PORT) : config.hubDiscoveryPort;
    const DISCOVERY_KEYWORD = process.env.DISCOVERY_KEYWORD ?? config.discoveryKeyword;
    const DISCOVERY_INTERVAL = process.env.DISCOVERY_INTERVAL ? Number.parseInt(process.env.DISCOVERY_INTERVAL) : config.discoveryInterval;
    const DISCOVERY_PORT = process.env.DISCOVERY_PORT ? Number.parseInt(process.env.DISCOVERY_PORT) : config.discoveryPort;

    if (!discoveryRunning) {
        const app = express();
        const port = HUB_DISCOVERY_PORT;
        app.get('/', function(req, res) {
            if (serverAddress !== undefined) {
                res.send(serverAddress);
            } else {
                res.sendStatus(204);
            }
        });
        app.listen(port);

        discoveryRunning = true;
        serverAddress = undefined;
        const socket = dgram.createSocket('udp4');

        socket.on('message', function (message, remote) {
            const [keyword, port] = message.toString().split(':');
            if (keyword === DISCOVERY_KEYWORD) {
                if (serverAddress === undefined) {
                    console.log("Server detected at " + remote.address + ', port ' + port);
                }
                if (discoveryTimeout) {
                    clearTimeout(discoveryTimeout);
                }
                serverAddress = remote.address + ':' + port;
                discoveryTimeout = setTimeout(() => {
                    serverAddress = undefined;
                    console.log("Server offline");
                }, 2 * DISCOVERY_INTERVAL);
            }
        });

        socket.on('error', () => {
            console.log('Discovery socket failed. Retrying...');
            setTimeout(() => socket.bind(DISCOVERY_PORT), DISCOVERY_INTERVAL);
        });
        socket.bind(DISCOVERY_PORT);
    }
}

const getServerAddress = () => {
    return serverAddress;
}

const discoveryService: DiscoveryService = {
    initialize,
    getServerAddress
}

export default discoveryService;
