import dgram from 'dgram'
import config from "../config";

const socket = dgram.createSocket('udp4');

export const initDiscovery = () => {
    const message = Buffer.from(config.discoveryKeyword + ':' + config.connectionPort);
    socket.on('listening', () => {
        socket.setBroadcast(true);
        setInterval(() => {
            socket.send(message, 0, message.length, config.discoveryPort, '255.255.255.255');
        }, config.discoveryInterval);
    });

    socket.bind(config.broadcastingPort);
}