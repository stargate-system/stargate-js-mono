import { RemoteServerConnector } from "./RemoteServerConnector";

export interface Remote {
    id: string,
    serverId: string,
    password: string
}

interface RemoteService {
    initialize: (remote: Remote) => void,
    getCredentials: () => Remote
}

const apiUrl = 'https://remote.stargate-system.com';
let remoteCredentials: Remote
let targetIp: string | undefined;
let attempts = 0;

const initialize = (remote: Remote) => {
    remoteCredentials = remote;
    discoverTarget();
}

const getCredentials = (): Remote => {
    return {...remoteCredentials};
}

const onOpen = () => {
    attempts = 0;
}

const onClose = () => {
    console.log('Remote connection closed');
    attempts++;
    if (attempts > 5) {
        targetIp = undefined;
    }
    setTimeout(() => {
        if (targetIp) {
            console.log(`Restoring connection (attempt ${attempts})...`);
            new RemoteServerConnector(targetIp, onClose, onOpen);
        } else {
            console.log('Running server discovery');
            discoverTarget();
        }
    }, attempts * 5000);
}

const discoverTarget = async () => {
    if (remoteCredentials) {
        try {
            const response = await fetch(`${apiUrl}/api/discover`,
                {
                    method: 'POST',
                    body: JSON.stringify(remoteCredentials)
                }
            )
            if (response.ok) {
                const result = await response.json();
                targetIp = result.ip;
                if (targetIp) {
                    console.log(`Found remote server on ${targetIp}`);
                    new RemoteServerConnector(targetIp, onClose, onOpen);
                } else {
                    console.log('Remote server ip missing');
                    setTimeout(discoverTarget, 60000);
                }
            } else {
                if (response.status === 404) {
                    console.log('Remote server appears offline...');
                    setTimeout(discoverTarget, 60000);
                } else {
                    console.log('Discovery failed', response.status);
                    setTimeout(discoverTarget, 3600000);
                }
            }
        } catch(err) {
            if (err instanceof TypeError) {
                console.log('On remote discovery', err.name, err.message);
                setTimeout(discoverTarget, 60000);
            } else {
                console.log('On remote discovery', err);
                setTimeout(discoverTarget, 3600000);
            }   
        }
    }
}

const remoteService: RemoteService = {
    initialize,
    getCredentials
}

export default remoteService;