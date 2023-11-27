import net from 'net';
import dgram from "dgram";
import {CoreConfig, Keywords, SocketWrapper} from "gate-core";
import {device} from "../../api/GateDevice";
import config from "../../api/config";
import fs from 'fs';

let handshakeTimeout: NodeJS.Timeout | undefined;

export const initLocalServer = () => {
    const socket = dgram.createSocket('udp4');

    socket.on('message', function (message, remote) {
        if (message.toString() === CoreConfig.discoveryKeyword) {
            const serverIp = remote.address;
            socket.close();
            connect(serverIp);
        }
    });

    socket.on('error', () => {
        console.log('Binding discovery socket failed. Retrying...');
        setTimeout(() => socket.bind(CoreConfig.discoveryPort), 5000);
    });
    socket.bind(CoreConfig.discoveryPort);
}

const connect = (serverIp: string) => {
    const socket = net.connect(CoreConfig.localServerDevicePort, serverIp, () => {
        socket.setNoDelay(true);
        socket.on('error', console.log);
        const socketWrapper: SocketWrapper = {
            send: socket.write.bind(socket),
            close: socket.destroy.bind(socket),
            setOnClose: (callback) => socket.on('close', () => {
                callback();
                initLocalServer();
            }),
            setOnMessage: (callback) => socket.on('data', (data: any) => callback(data.toString()))
        }
        handleConnection(socketWrapper);
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
    }, config.handShakeTimeout);

    const connectionStateListenerKey = device.connection.addStateChangeListener(() => {
        clearHandshakeListeners(connectionStateListenerKey);
    });
    const functionalHandler = device.connection.functionalHandler;
    functionalHandler.addCommandListener(Keywords.assignedId, (params) => {
        if (params) {
            const assignedId = params[0];
            // @ts-ignore
            device.manifest.id = assignedId;
            saveId(assignedId);
        }
    })
    functionalHandler.addQueryListener(Keywords.manifest, (respond: (response: string) => void) => {
        respond(JSON.stringify(device.manifest));
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
    functionalHandler.removeQueryListener(Keywords.manifest);
    functionalHandler.removeCommandListener(Keywords.ready);
    functionalHandler.removeCommandListener(Keywords.assignedId);
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