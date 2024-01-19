import dgram from 'dgram'
import config from "../config";

const DISCOVERY_KEYWORD = process.env.DISCOVERY_KEYWORD ?? config.discoveryKeyword;
const CONNECTION_PORT = process.env.CONNECTION_PORT ? Number.parseInt(process.env.CONNECTION_PORT) : config.connectionPort;
const DISCOVERY_PORT = process.env.DISCOVERY_PORT ? Number.parseInt(process.env.DISCOVERY_PORT) : config.discoveryPort;
const DISCOVERY_INTERVAL = process.env.DISCOVERY_INTERVAL ? Number.parseInt(process.env.DISCOVERY_INTERVAL) : config.discoveryInterval;
const BROADCASTING_SOCKET_PORT = process.env.BROADCASTING_SOCKET_PORT ? Number.parseInt(process.env.BROADCASTING_SOCKET_PORT) : config.broadcastingSocketPort;

const socket = dgram.createSocket('udp4');
const message = Buffer.from(DISCOVERY_KEYWORD + ':' + CONNECTION_PORT);

export const initDiscovery = () => {
    socket.on('listening', () => {
        socket.setBroadcast(true);
        setInterval(() => {
            socket.send(message, 0, message.length, DISCOVERY_PORT, '255.255.255.255');
        }, DISCOVERY_INTERVAL);
    });

    socket.bind(BROADCASTING_SOCKET_PORT);
}