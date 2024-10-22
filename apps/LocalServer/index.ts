import express from 'express';
import {initDiscovery} from "./src/DiscoveryService";
import getBasicRepository from "./src/persistence/BasicSystemRepository";
import {initConnectionService} from "./src/ConnectionService";
import Router from "./src/Router";
import {initDeviceContext} from "./src/device/DeviceContext";
import config from "./config";
import ip from 'ip';
import fs from 'fs';
import { authenticate, initRemote, login, connect, apiUrl, getCertificates } from './src/RemoteService';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import https from 'https';

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

const initServer = (authenticated: boolean) => {
    const app = express();
    let options = {};
    if (authenticated) {
        options = getCertificates();
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.post('/connect', cors({origin: apiUrl}), connect);
        app.get('/login', login);
        app.use('/ui', (req, res, next) => {
            try{
                if (req.cookies?.stargate_client && authenticate(JSON.parse(req.cookies.stargate_client))) {
                    next();
                } else {
                    res.status(403).end();
                }
            } catch(err) {
                console.log('On static content authentication', err);
                res.status(403).end();
            }
        });
    } else {
        app.get('/', (req, res) => {
            res.redirect('/ui/index.html');
        });
    }
    app.use('/ui', express.static(__dirname + '/../out'));
    // const server = app.listen(authenticated ? config.authenticatedPort : config.connectionPort);
    const server = authenticated
        ? https.createServer(options, app).listen(config.authenticatedPort)
        : app.listen(config.connectionPort);

    initConnectionService(server, authenticated);
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
        initServer(false);
    }
    if (config.authenticatedPort) {
        initRemote();
        initServer(true);
    }
})
