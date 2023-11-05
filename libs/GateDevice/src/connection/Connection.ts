import config from "../../config.js";
import {initServerless} from "./serverless/Serverless.js";
import {Directions} from 'gate-core';
import {state} from "../GateDevice";
import logger from "../logger/logger";

export const startConnection = () => {
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
                targetValue.remoteValue = change[1];
            }
        } else {
            logger.logWarning('Unknown value with id: ' + change[0]);
        }
    })
}

