import {Directions, ConnectionState} from "gate-core";
import GateDevice from "./src/api/GateDevice.js";
import {DeviceState} from "./src/api/DeviceState.js";
import config from "./config.js";

if (process.env.HUB_DISCOVERY_PORT) {
    config.hubDiscoveryPort = Number.parseInt(process.env.HUB_DISCOVERY_PORT);
}
if (process.env.DISCOVERY_KEYWORD) {
    config.discoveryKeyword = process.env.DISCOVERY_KEYWORD;
}
if (process.env.DISCOVERY_PORT) {
    config.discoveryPort = Number.parseInt(process.env.DISCOVERY_PORT);
}
if (process.env.DISCOVERY_INTERVAL) {
    config.discoveryInterval = Number.parseInt(process.env.DISCOVERY_INTERVAL);
}
if (process.env.OUTPUT_BUFFER_DELAY) {
    config.outputBufferDelay = Number.parseInt(process.env.OUTPUT_BUFFER_DELAY);
}
if (process.env.QUERY_TIMEOUT) {
    config.queryTimeout = Number.parseInt(process.env.QUERY_TIMEOUT);
}
if (process.env.HANDSHAKE_TIMEOUT) {
    config.handshakeTimeout = Number.parseInt(process.env.HANDSHAKE_TIMEOUT);
}
if (process.env.OUTPUT_BUFFER_DELAY) {
    config.outputBufferDelay = Number.parseInt(process.env.OUTPUT_BUFFER_DELAY);
}
if (process.env.USE_PING) {
    config.usePing = process.env.USE_PING.toLowerCase() === 'true';
}

export {
    Directions,
    ConnectionState,
    DeviceState,
    GateDevice
};
