import net from 'net';
import {CoreConfig} from "gate-core";
import {LocalDeviceConnector} from "./LocalDeviceConnector";
import {Router} from "gate-router";

export const initDeviceService = () => {
    const server = net.createServer(handleConnection);
    server.listen(CoreConfig.localServerDevicePort);
}

const handleConnection = (socket: net.Socket) => {
    const connector = new LocalDeviceConnector(socket);
    connector.onConnectorReady = () => Router.addDevice(connector);
}