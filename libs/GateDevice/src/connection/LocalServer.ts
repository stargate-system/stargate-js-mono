import {WebSocket} from 'ws';
import {ConnectionState, ConnectionType, Keywords, SocketWrapper} from "@stargate-system/core";
import {device} from "../device/GateDevice.js";
import fs from 'fs';
import config from "../../config.js";
import {DefaultDiscoveryService} from '@stargate-system/discovery'

let handshakeTimeout: NodeJS.Timeout | undefined;
let lastKnownServerAddress: string | undefined;

export const initLocalServer = () => {
    if (config.useFixedUrl) {
        connect(config.fixedUrl);
    } else if (lastKnownServerAddress !== undefined) {
        connect(lastKnownServerAddress);
        lastKnownServerAddress = undefined;
    } else {
        DefaultDiscoveryService.setConfig(config);
        DefaultDiscoveryService.executeWhenServerFound(config.discoveryKeyword, connect, config.hubDiscoveryPort);
    }
}

const connect = (serverAddress: string) => {
    const socket = new WebSocket('ws://' + serverAddress);
    const socketWrapper: SocketWrapper = {
        send: socket.send.bind(socket),
        close: () => {
            socket.removeAllListeners();
            socket.close();
        },
        setOnClose: (callback) => socket.on('close', callback),
        setOnMessage: (callback) => socket.on('message', (ev: any) => callback(ev.toString()))
    }
    socket.on('error', console.log);
    socket.onopen = () => {
        console.log('Connected to ' + serverAddress);
        handleConnection(socketWrapper, serverAddress);
    }
}

const handleConnection = (socketWrapper: SocketWrapper, serverAddress: string) => {
    device.connection.setConnected(socketWrapper);
    const key = device.connection.addStateChangeListener((state) => {
        if (state === ConnectionState.closed) {
            if (device.isStopped) {
                lastKnownServerAddress = serverAddress;
            } else {
                console.log('Connection closed. Reconnecting...');
                setTimeout(initLocalServer, 5000);
            }
            device.connection.removeStateChangeListener(key);
        }
    });
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
        console.log('Connection ready');
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