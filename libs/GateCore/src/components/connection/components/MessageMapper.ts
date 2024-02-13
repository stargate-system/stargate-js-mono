import Markers from "../../../constants/Markers.js";
import {ValueMessage} from "../../../interfaces/ValueMessage";

const {
    mainSeparator,
    auxSeparator,
    functionalMessagePrefix,
    commandPrefix,
    queryPrefix,
    answerPrefix
} = Markers;

const serializeArray = (array: Array<string>) => {
    let messages = '';
    let lengths = '';
    array.forEach((message) => {
        lengths += message.length + auxSeparator;
        messages += message;
    });
    return lengths.slice(0, -1) + mainSeparator + messages;
}

const parseArray = (message: string) => {
    const separator = message.indexOf(mainSeparator);
    const lengths = message.slice(0, separator).split(auxSeparator).map((val) => Number.parseInt(val));
    const messagesString = message.slice(separator + 1);
    if (lengths.reduce((a, b) => a + b) !== messagesString.length) {
        throw new Error('Messages length inconsistent with declared: ' + message);
    }
    const messagesArray: Array<string> = [];
    let currentIndex = 0;
    let nextIndex;
    lengths.forEach((length) => {
        nextIndex = currentIndex + length;
        messagesArray.push(messagesString.substring(currentIndex, nextIndex));
        currentIndex = nextIndex;
    });
    return messagesArray;
}

const serializeValueMessage = (valueMessage: ValueMessage) => {
    let ids = '';
    const values: Array<string> = [];
    valueMessage.forEach((entry) => {
        ids += entry[0] + auxSeparator;
        values.push(entry[1]);
    });
    const serializedValues = serializeArray(values);
    return ids.slice(0, -1) + mainSeparator + serializedValues;
}

const parseValueMessage = (message: string): ValueMessage => {
    const firstSeparator = message.indexOf(mainSeparator);
    const ids = message.slice(0, firstSeparator).split(auxSeparator);
    const serializedValues = message.slice(firstSeparator + 1);
    let messages: string[];
    try {
        messages = parseArray(serializedValues);
    } catch (err) {
        throw new Error('On parsing value message ' + message + ' reason: ' + err)
    }
    if (ids.length !== messages.length) {
        throw new Error('Ids count not match messages count: ' + message);
    }
    const result: ValueMessage = [];
    ids.forEach((id, index) => {
        result.push([id, messages[index]]);
    });
    return result;
}

const functionalMessage = (msg: string) => {
    return functionalMessagePrefix + msg;
}

const command = (keyword: string, params?: Array<string>) => {
    let message = commandPrefix + keyword;
    if (params !== undefined && params.length) {
        message += mainSeparator + serializeArray(params);
    }
    return functionalMessage(message);
}

const query = (msg: string, params?: string[]) => {
    let message = queryPrefix + msg;
    if (params !== undefined && params.length) {
        message += mainSeparator + serializeArray(params);
    }
    return functionalMessage(message);
}

const answer = (query: string, msg: string) => {
    const separatorIndex = query.indexOf(Markers.mainSeparator);
    const keyword = separatorIndex !== -1 ? query.substring(2, separatorIndex) : query.substring(2);
    return functionalMessage(answerPrefix + keyword + mainSeparator + msg);
}

export default {
    serializeArray,
    parseArray,
    serializeValueMessage,
    parseValueMessage,
    functionalMessage,
    command,
    query,
    answer
}