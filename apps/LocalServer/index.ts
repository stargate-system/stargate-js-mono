import express from 'express';
import {initDiscovery} from "./src/DiscoveryService";
import getBasicRepository from "./src/persistence/BasicSystemRepository";
import {initConnectionService} from "./src/ConnectionService";
import Router from "./src/Router";
import {initDeviceContext} from "./src/device/DeviceContext";
import config from "./config";
import ip from 'ip';
import fs from 'fs';
import { initRemote } from './src/RemoteService';

if (process.env.DISCOVERY_KEYWORD) {
    config.discoveryKeyword = process.env.DISCOVERY_KEYWORD;
}
if (process.env.DISCOVERY_INTERVAL) {
    config.discoveryInterval = Number.parseInt(process.env.DISCOVERY_INTERVAL);
}
if (process.env.DISCOVERY_PORT) {
    config.discoveryPort = Number.parseInt(process.env.DISCOVERY_PORT);
}
if (process.env.CONNECTION_PORT) {
    config.connectionPort = Number.parseInt(process.env.CONNECTION_PORT);
}
if (process.env.AUTHENTICATED_PORT) {
    config.authenticatedPort = Number.parseInt(process.env.AUTHENTICATED_PORT);
}
if (process.env.BROADCASTING_PORT) {
    config.broadcastingPort = Number.parseInt(process.env.BROADCASTING_PORT);
}
if (process.env.ENABLE_DISCOVERY) {
    config.enableDiscovery = process.env.ENABLE_DISCOVERY.toLowerCase() === 'true';
}

const initServer = () => {
    const app = express();
    app.get('/', (req, res) => {
        res.redirect('/ui/index.html');
    });
    app.use('/ui', express.static(__dirname + '/../out'));
    const server = app.listen(config.connectionPort);
    initConnectionService(server, false);
}

const serverIp = ip.address();
if (serverIp) {
    const serverAddress = 'http://' + serverIp + ':' + (config.connectionPort ?? config.authenticatedPort);
    fs.writeFile('ServerLink.txt',
        serverAddress,
        (err) => {
        if (err) {
            console.log('On saving server link', err);
        }
    });
    console.log('Server running on ' + serverAddress);
}

Router.systemRepository = getBasicRepository();
initDeviceContext().then(() => {
    if (config.enableDiscovery) {
        initDiscovery();
    }
    if (config.connectionPort) {
        initServer();
    }
    if (config.authenticatedPort) {
        initRemote();
    }
})
