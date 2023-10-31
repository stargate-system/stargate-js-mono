import { WebSocketServer } from 'ws';
import config from "../../config.js";
import core from 'gatecore';
import GateFactory from "../GateFactory.js";
import {connectionStatus, closeConnection, initConnection} from "../Connection.js";

const {serialize} = core.MessageMapper;
const {Messages} = core.ApiCommons;

export const initServerless = (connection) => {
    const server = new WebSocketServer({port: config.port});
    server.on('connection', (socket) => handleConnection(socket, connection));
}

let removeHandshakeListeners = () => {};

const setHandshakeListeners = (connection) => {
    const functionalHandler = connection.functionalHandler;
    functionalHandler.addQueryListener(Messages.manifest, (respond) => {
        respond(JSON.stringify(GateFactory.state.manifest));
    });
    functionalHandler.addQueryListener(Messages.allStates, (respond) => {
        const messageMap = {};
        core.ValueFactory.inputValues.forEach((value) => messageMap[value.id] = value.toString());
        core.ValueFactory.outputValues.forEach((value) => messageMap[value.id] = value.toString());
        respond(serialize(messageMap));
    });
    const infoListenerKey = functionalHandler.addInfoListener((keyword) => {
        if (keyword === Messages.ready) {
            connection.status = connectionStatus.ready;
            connection.onStateChange();
            removeHandshakeListeners();
        }
    });
    removeHandshakeListeners = () => {
        functionalHandler.removeInfoListener(infoListenerKey);
        functionalHandler.removeQueryListener(Messages.manifest);
        functionalHandler.removeQueryListener(Messages.allStates);
        removeHandshakeListeners = () => {};
    }
}

const handleConnection = (socket, connection) => {
    if (connection.status !== connectionStatus.closed) {
        socket.close();
    } else {
        connection.status = connectionStatus.connected;
        const onMessage = initConnection((msg) => socket.send(msg));
        socket.on('message', onMessage);
        socket.on('close', () => {
            if (connection.status === connectionStatus.connected) {
                removeHandshakeListeners();
            }
            closeConnection();
        });
        setHandshakeListeners(connection);
    }
};
