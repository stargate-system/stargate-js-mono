import fs from 'fs';
import config from '../config';
import generator from "generate-password";
import selfsigned from 'selfsigned';

export const apiUrl = 'https://stargate-user-frontend.onrender.com';
const connections = new Map<string, string>();
const clients = new Map<string, string>();
let serverId: string;
let serverKey: string;

let initInterval: NodeJS.Timeout | undefined;

export const initRemote = () => {
    try {
        const idFile = fs.readFileSync('remote/id.txt').toString();
        const [id, key] = idFile.split(',').map((word) => word.trim());
        serverId = id;
        serverKey = key;
        if (!id || !key) {
            throw new Error('Id or key missing');
        }
        fetch(`${apiUrl}/api/register`,
            {
                method: 'POST',
                body: JSON.stringify({id, key, port: config.authenticatedPort})
            }
        ).then((res) => res.ok ? console.log('Registered in central service') : console.log('Failed to register in central service', res.status))
        .catch((err) => console.log('Failed to register in central service', err));
    } catch(err) {
        // @ts-ignore
        console.log('Unable to initialize remote service', err);
    }
    if (!initInterval) {
        initInterval = setInterval(initRemote, 3600000);
    }
}

export const getCertificates = () => {
    const generated = selfsigned.generate([{name: 'commonName', value: 'StarGate Local Server'}], {keySize: 2048, days: 365});
    return {key: generated.private, cert: generated.cert};
}

export const connect = async (req: any, res: any) => {
    const {connectionId} = req.body;
    const response = await fetch(`${apiUrl}/api/connect`, {method: 'POST', body: JSON.stringify({connectionId, serverId, serverKey})});
    if (response.ok) {
        const keys = await response.json();
        connections.set(connectionId, keys.connectionKey);
        setTimeout(() => connections.delete(connectionId), 20000);
        res.json({verificationKey: keys.verificationKey});
    } else {
        res.status(403).end();
    }
}

export const login = (req: any, res: any) => {
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

    res.cookie('stargate_client', JSON.stringify({clientId, clientKey}));
    res.redirect('/ui/index.html');
}

export const authenticate = (auth?: any) => {
    if (auth && auth.clientId && clients.get(auth.clientId) === auth.clientKey) {
        return true;
    }
    return false;
}