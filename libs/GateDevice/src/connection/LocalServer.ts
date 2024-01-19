import {WebSocket} from 'ws';
import dgram from "dgram";
import {ConnectionType, Keywords, SocketWrapper} from "gate-core";
import {device} from "../api/GateDevice.js";
import fs from 'fs';
import config from "../../config.js";

let handshakeTimeout: NodeJS.Timeout | undefined;

export const initLocalServer = () => {

    const socket = dgram.createSocket('udp4');

    socket.on('message', function (message, remote) {
        const [keyword, port] = message.toString().split(':');
        if (keyword === config.discoveryKeyword) {
            const serverIp = remote.address;
            console.log("Discovered server ip: " + serverIp + ', port: ' + port);
            socket.close();
            connect(serverIp + ':' + port);
        }
    });

    socket.on('error', () => {
        checkHub(socket);
    });
    socket.bind(config.discoveryPort);
}

const checkHub = (socket: dgram.Socket) => {
    fetch("http://localhost:" + config.hubDiscoveryPort).then((response) => {
        if (response.status === 204) {
            console.log("Waiting for server ip...")
            setTimeout(() => checkHub(socket), config.discoveryInterval);
        } else {
            response.text().then((serverAddress) => {
                console.log("Received server address: " + serverAddress);
                socket.close();
                connect(serverAddress);
            });
        }
    }).catch(() => {
        console.log('Binding discovery socket failed. Retrying...');
        setTimeout(() => socket.bind(config.discoveryPort), config.discoveryInterval);
    });
}

const connect = (serverAddress: string) => {
    const socket = new WebSocket('ws://' + serverAddress);
    const socketWrapper: SocketWrapper = {
        send: socket.send.bind(socket),
        close: socket.close.bind(socket),
        setOnClose: (callback) => socket.on('close', callback),
        setOnMessage: (callback) => socket.on('message', (ev: any) => callback(ev.toString()))
    }
    socket.onopen = () => {
        handleConnection(socketWrapper);
    }
    socket.on('error', console.log);
    socket.on('close', () => {
        console.log('Reconnecting...');
        setTimeout(initLocalServer, 5000);
    });
}

const handleConnection = (socketWrapper: SocketWrapper) => {
    device.connection.setConnected(socketWrapper);
    setHandshakeListeners();
};

const setHandshakeListeners = () => {
    handshakeTimeout = setTimeout(() => {
        device.connection.close();
        handshakeTimeout = undefined;
    }, config.handshakeTimeout);

    const connectionStateListenerKey = device.connection.addStateChangeListener(() => {
        clearHandshakeListeners(connectionStateListenerKey);
    });
    const functionalHandler = device.connection.functionalHandler;
    functionalHandler.addQueryListener(Keywords.type, (respond) => {
        respond(ConnectionType.device);
    });
    functionalHandler.addQueryListener(Keywords.manifest, (respond) => {
        respond(JSON.stringify(device.manifest));
    });
    functionalHandler.addCommandListener(Keywords.assignedId, (params) => {
        if (params) {
            const assignedId = params[0];
            // @ts-ignore
            device.manifest.id = assignedId;
            saveId(assignedId);
        }
    });
    functionalHandler.addCommandListener(Keywords.ready, () => {
        device.connection.setReady();
    });
};

const clearHandshakeListeners = (connectionStateListenerKey: string) => {
    if (handshakeTimeout) {
        clearTimeout(handshakeTimeout);
        handshakeTimeout = undefined;
    }
    device.connection.removeStateChangeListener(connectionStateListenerKey);
    const functionalHandler = device.connection.functionalHandler;
    functionalHandler.removeQueryListener(Keywords.type);
    functionalHandler.removeQueryListener(Keywords.manifest);
    functionalHandler.removeCommandListener(Keywords.assignedId);
    functionalHandler.removeCommandListener(Keywords.ready);
};

const saveId = (id: string) => {
    const storedId = {
        id: id
    }
    fs.writeFile('id.json', JSON.stringify(storedId), (err) => {
        if (err) {
            console.log('On saving id', err);
        }
    });
}