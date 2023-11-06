import config from "../../config.js";
import {initServerless} from "./serverless/Serverless.js";
import {ConnectionState, Directions} from 'gate-core';
import {state} from "../GateDevice.js";
import logger from "../logger/logger.js";

export const startConnection = () => {
    state.connection.addStateChangeListener(() => {
        switch (state.connection.state) {
            case ConnectionState.closed:
                state.outputBuffer.setSendFunction(undefined);
                break;
            case ConnectionState.ready:
                if (state.connection.handler?.sendValueMessage) {
                    state.outputBuffer.setSendFunction(state.connection.handler.sendValueMessage);
                }
                break;
        }
    });

    if (config.serverless) {
        initServerless(onValueMessage);
    } else {
        throw new Error('Not implemented');
    }
}

const onValueMessage = (changes: Array<[string, string]>) => {
    changes.forEach((change) => {
        const targetValue = state.values.getByKey(change[0]);
        if (targetValue !== undefined) {
            if (targetValue.direction === Directions.output) {
                logger.logWarning('Attempting to remotely change output value: ' + targetValue.valueName)
            } else {
                targetValue.fromRemote(change[1]);
            }
        } else {
            logger.logWarning('Unknown value with id: ' + change[0]);
        }
    })
}

