import config from "../config.js";
import {initServerless} from "./serverless/Serverless.js";
import core from 'gatecore';
import {SocketHandler} from 'gatecore';

export const startConnection = () => {
    if (config.serverless) {
        initServerless(connection);
    }
    return connection;
}

export const connectionStatus = {
    closed: 'closed',
    connected: 'connected',
    ready: 'ready'
}

export const closeConnection = () => {
    connection.status = connectionStatus.closed;
    connection.send = () => {};
    core.config.outputBufferSendFunction = () => {};
    connection.onStateChange();
}

export const initConnection = (sendFunction) => {
    connection.send = sendFunction;
    core.config.outputBufferSendFunction = sendFunction;
    const socketHandler = new SocketHandler(sendFunction, core.ValueMessages.deliverToInputs);
    connection.functionalHandler = socketHandler.functionalHandler;
    const onMessage = (msg) => {
        socketHandler.onMessage(msg);
        connection.onMessage(msg);
    }
    connection.status = connectionStatus.connected;
    connection.onStateChange();
    return onMessage;
}

const connection = {
    status: connectionStatus.closed,
    send: () => {},
    onStateChange: () => {},
    onMessage: () => {},
    functionalHandler: undefined
}
