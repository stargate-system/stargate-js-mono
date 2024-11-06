import fs from 'fs';
import config from '../config';
import generator from "generate-password";
import selfsigned from 'selfsigned';
import crypto from 'crypto';
import https from 'https';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import {initConnectionService} from "./ConnectionService";
import ControllerContext from './controller/ControllerContext';

const apiUrl = 'https://stargate-user-frontend.onrender.com';
const connections = new Map<string, string>();
const clients = new Map<string, string>();
const states = {
    on: 'on',
    off: 'off',
    init: 'init',
    registered: 'ready',
    error: 'error'
}
let state = states.off;
let serverId: string | undefined;
let serverKey: string | undefined;
let server: https.Server | undefined;
let currentIp: string | undefined;
let registerTimeout: NodeJS.Timeout | undefined;
let ipCheckInterval: NodeJS.Timeout | undefined;
let initTimeout: NodeJS.Timeout | undefined;
let stateTimeout: NodeJS.Timeout | undefined;

export const getRemoteAccessState = () => state;

export const setRemoteCredentials = (key: string, pass: string) => {
    stopRemote();
    try {
        if (!fs.existsSync('remote')) {
            fs.mkdirSync('remote');
        }
        fs.writeFileSync('remote/id.txt', `${key}, ${pass}`);
    } catch(err) {
        console.log('On saving remote credentials', err);
    }
    initRemote();
}

export const initRemote = async () => {
    if (!initTimeout && (state === states.off || state === states.error)) {
        config.enableExternalAccess = true;
        try {
            const idFile = fs.readFileSync('remote/id.txt').toString();
            const [id, key] = idFile.split(',').map((word) => word.trim());
            serverId = id;
            serverKey = key;
            if (!id || !key) {
                throw new Error('Id or key missing');
            }
            changeState(states.init);
            currentIp = await getPublicIp();
            if (currentIp) {
                initServer(currentIp);
                initIpCheck();
                changeState(states.on);
            } else {
                initTimeout = setTimeout(() => {
                    changeState(states.off);
                    initTimeout = undefined;
                    initRemote()
                }, 5000);
            }
        } catch(err) {
            changeState(states.error);
            console.log(
                'Unable to initialize remote service:',
                (err instanceof Error && err.message.match(/no such file or directory/i)) ? 'No remote credentials available' : err
            );
        }
    }
}

export const authenticate = (auth?: any) => {
    if (auth && auth.clientId && clients.get(auth.clientId) === auth.clientKey) {
        return true;
    }
    return false;
}

export const stopRemote = (error = false) => {
    config.enableExternalAccess = false;
    if (registerTimeout) {
        clearTimeout(registerTimeout);
        registerTimeout = undefined;
    }
    if (ipCheckInterval) {
        clearInterval(ipCheckInterval);
        ipCheckInterval = undefined;
    }
    if (initTimeout) {
        clearTimeout(initTimeout);
        initTimeout = undefined;
    }
    connections.clear();
    clients.clear();
    if (server) {
        server.close((err) => {
            if (err) {
                console.log('On closing https server', err);
            }
        });
        server = undefined;
    }
    changeState(error ? states.error : states.off);
}

const changeState = (newState: string) => {
    state = newState;
    if (!stateTimeout) {
        stateTimeout = setTimeout(() => {
            stateTimeout = undefined;
            // TODO move remoteAccess to EventNames
            ControllerContext.forwardServerEvent('remoteAccess', [state]);
        }, 100);
    }
}

const initIpCheck = () => {
    if (ipCheckInterval) {
        clearInterval(ipCheckInterval);
    }
    ipCheckInterval = setInterval(async () => {
        const ip = await getPublicIp();
        if (ip && ip !== currentIp) {
            currentIp = ip;
            initServer(ip);
        }
    }, 60000);
}

const initServer = (ip: string) => {
    if (server) {
        server.close((err) => {
            if (err) {
                console.log('On closing https server', err);
            }
        });
    }
    if (registerTimeout) {
        clearTimeout(registerTimeout);
        registerTimeout = undefined;
    }
    register();
    const app = express();
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
    app.use('/ui', express.static(__dirname + '/../out'));
    server = https.createServer(getCertificates(ip), app).listen(config.authenticatedPort);
    initConnectionService(server, true);
}

const getPublicIp = async () => {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
            const ip = await ipResponse.json();
            return ip.ip;
        }
    } catch {}
    return undefined;
}

const getCertificates = (ip: string) => {
    const generated = selfsigned.generate([{name: 'commonName', value: ip}], {keySize: 2048, days: 365});
    return {key: generated.private, cert: generated.cert};
}

const register = async () => {
    if (registerTimeout) {
        clearTimeout(registerTimeout);
        registerTimeout = undefined;
    }
    if (serverId && serverKey) {
        let registerResponse;
        try {
            registerResponse = await fetch(`${apiUrl}/api/register`,
                {
                    method: 'POST',
                    body: JSON.stringify({id: serverId, key: serverKey, port: config.authenticatedPort})
                }
            )
        } catch {}
        if (registerResponse && registerResponse.ok) {
            console.log('Registered in central service');
            changeState(states.registered);
        } else {
            if (!registerResponse || registerResponse.status !== 403) {
                registerTimeout = setTimeout(register, 10000);
                console.log('Failed to register in central service', registerResponse?.status ?? 'fetch failed');
            } else {
                console.log('Failed to register in central service: wrong server credentials');
                stopRemote(true);
            }
        }
    }
}

const connect = async (req: any, res: any) => {
    const {connectionId} = req.body;
    let response;
    try {
        response = await fetch(`${apiUrl}/api/connect`, {method: 'POST', body: JSON.stringify({connectionId, serverId, serverKey})});
    } catch {}
    if (response && response.ok) {
        const keys = await response.json();
        connections.set(connectionId, keys.connectionKey);
        setTimeout(() => connections.delete(connectionId), 20000);
        res.json({verificationKey: keys.verificationKey});
    } else {
        res.status(403).end();
    }
}

const login = (req: any, res: any) => {
    const id = req.query.id;
    const key = req.query.key;
    if (typeof id !== 'string' || typeof key !== 'string' || connections.get(id) !== key) {
        res.status(403).end();
        return;
    }
    connections.delete(id);
    const clientId = crypto.randomUUID();
    const clientKey = generator.generate({
        length: 32,
        numbers: true
    });
    clients.set(clientId, clientKey);

    // 1 hour
    const maxAge = 3600000
    setTimeout(() => clients.delete(clientId), maxAge);
    res.cookie('stargate_client', JSON.stringify({clientId, clientKey}), {maxAge});
    res.redirect('/ui/index.html');
}