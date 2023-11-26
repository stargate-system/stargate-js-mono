import dgram from 'dgram'
import {CoreConfig} from 'gate-core';

const socket = dgram.createSocket('udp4');
const message = Buffer.from(CoreConfig.discoveryKeyword);

export const initDiscovery = () => {
    socket.on('listening', () => {
        socket.setBroadcast(true);
        setInterval(() => {
            socket.send(message, 0, message.length, CoreConfig.discoveryPort, '255.255.255.255');
        }, 5000);
    });

    socket.bind(CoreConfig.broadcastingSocketPort);
}