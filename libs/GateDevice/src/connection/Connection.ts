import config from "../../config.js";
import {initServerless} from "./serverless/Serverless.js";
import {Directions, MessageMapper, SocketHandler} from 'gate-core';
import {state} from "../GateDevice";
import logger from "../logger/logger";

export interface Connection {
    status: ConnectionStatus,
    socketHandler: SocketHandler | undefined,
    onStatusChange: (() => void) | undefined
}
export const startConnection = (): Connection => {
    if (config.serverless) {
        initServerless(connection);
    } else {
        throw new Error('Not implemented');
    }
    return connection;
}

export enum ConnectionStatus {
    closed = 'closed',
    connected = 'connected',
    ready = 'ready'
}

export const closeConnection = () => {
    connection.status = ConnectionStatus.closed;
    connection.socketHandler = undefined;
    if (connection.onStatusChange) {
        connection.onStatusChange();
    }
}

export const initConnection = (sendFunction: (message: string) => void) => {
    connection.socketHandler = new SocketHandler(sendFunction, onValueMessage);
    const onMessage = (msg: string) => {
        connection.socketHandler?.handleMessage(msg);
    }
    connection.status = ConnectionStatus.connected;
    if (connection.onStatusChange) {
        connection.onStatusChange();
    }
    return onMessage;
}

export const connectionReady = () => {
    connection.status = ConnectionStatus.ready;
    if (connection.onStatusChange) {
        connection.onStatusChange();
    }
}

const onValueMessage = (message: string) => {
    const changes = MessageMapper.parseValueMessage(message);
    changes.forEach((change) => {
        const targetValue = state.values.getByKey(change[0]);
        if (targetValue !== undefined) {
            if (targetValue.direction === Directions.output) {
                logger.logWarning('Attempting to remotely change output value: ' + targetValue.valueName)
            } else {
                targetValue.remoteValue = change[1];
            }
        } else {
            logger.logWarning('Unknown value with id: ' + change[0]);
        }
    })
}

const connection: Connection = {
    status: ConnectionStatus.closed,
    socketHandler: undefined,
    onStatusChange: undefined
}
