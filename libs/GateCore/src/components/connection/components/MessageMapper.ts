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

const serializeArray = (array: string[]) => {
    if (array.length === 0) {
        return mainSeparator;
    }
    let messages = '';
    let lengths = '';
    array.forEach((message) => {
        lengths += message.length + auxSeparator;
        messages += message;
    });
    return lengths.slice(0, -1) + mainSeparator + messages;
}

const parseArray = (message: string): [string[], string] => {
    if (message.charAt(0) === mainSeparator) {
        return [[], message.substring(1)];
    }
    const separatorIndex = message.indexOf(mainSeparator);
    const lengths = message.slice(0, separatorIndex).split(auxSeparator).map((val) => Number.parseInt(val));
    const arrayStringLength = lengths.reduce((a, b) => a + b);
    const arrayString = message.slice(separatorIndex + 1);
    if (arrayStringLength > arrayString.length) {
        throw new Error('Messages length inconsistent with declared: ' + message);
    }
    const messagesArray: string[] = [];
    let currentIndex = 0;
    let nextIndex;
    lengths.forEach((length) => {
        nextIndex = currentIndex + length;
        messagesArray.push(arrayString.substring(currentIndex, nextIndex));
        currentIndex = nextIndex;
    });
    return [messagesArray, message.substring(separatorIndex + 1 + arrayStringLength)];
}

const serializeValueMessage = (valueMessage: ValueMessage) => {
    if (valueMessage.length) {
        let ids = '';
        const values: string[] = [];
        valueMessage.forEach((entry) => {
            ids += entry[0] + auxSeparator;
            values.push(entry[1]);
        });
        const serializedValues = serializeArray(values);
        return ids.slice(0, -1) + mainSeparator + serializedValues;
    }
    return '';
}

const parseValueMessage = (message: string): ValueMessage => {
    const firstSeparator = message.indexOf(mainSeparator);
    const ids = message.slice(0, firstSeparator).split(auxSeparator);
    const serializedValues = message.slice(firstSeparator + 1);
    let messages: string[];
    let remainingString = '';
    try {
        const result = parseArray(serializedValues);
        messages = result[0];
        remainingString = result[1];
    } catch (err) {
        throw new Error('On parsing value message ' + message + ' reason: ' + err)
    }
    if (remainingString.length) {
        console.log('WARNING: part of message dropped after parsing value message - ' + remainingString);
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

const command = (keyword: string, params?: string[]) => {
    let message = commandPrefix + keyword;
    message += mainSeparator + serializeArray(params ?? []);
    return functionalMessage(message);
}

const query = (msg: string, params?: string[]) => {
    let message = queryPrefix + msg;
    message += mainSeparator + serializeArray(params ?? []);
    return functionalMessage(message);
}

const answer = (query: string, msg: string) => {
    const separatorIndex = query.indexOf(Markers.mainSeparator);
    const keyword = separatorIndex !== -1 ? query.substring(2, separatorIndex) : query.substring(2);
    return functionalMessage(answerPrefix + keyword + mainSeparator + serializeArray([msg]));
}

const acknowledge = () => {
    return functionalMessage(Markers.acknowledge);
}

const ping = () => {
    return functionalMessage(Markers.ping);
}

export default {
    serializeArray,
    parseArray,
    serializeValueMessage,
    parseValueMessage,
    functionalMessage,
    command,
    query,
    answer,
    acknowledge,
    ping
}