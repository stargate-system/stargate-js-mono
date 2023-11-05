import Markers from "./Markers";

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
    if (lengths.reduce((a, b) => a + b) !== message.length) {
        throw new Error('Messages length inconsistent with declared');
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

const serializeValueMessage = (messageMap: Object) => {
    let ids = '';
    let lengths = '';
    let messages = '';
    Object.keys(messageMap).forEach((id) => {
        ids += id + auxSeparator;
    });
    Object.values(messageMap).forEach((message) => {
        if (typeof message !== 'string') {
            throw new Error('Attempt to serialize non-string message');
        }
        lengths += message.length + auxSeparator;
        messages += message;
    });
    const serializedValues = serializeArray(Object.values(messageMap));
    return ids.slice(0, -1) + mainSeparator + serializedValues;
}

const parseValueMessage = (message: string): Array<[string, string]> => {
    const firstSeparator = message.indexOf(mainSeparator);
    const ids = message.slice(0, firstSeparator).split(auxSeparator);
    const serializedValues = message.slice(firstSeparator + 1);
    const messages = parseArray(serializedValues);
    if (ids.length !== messages.length) {
        throw new Error('Ids count not match messages count');
    }
    const result: Array<[string, string]> = [];
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
    if (params !== undefined) {
        message += mainSeparator + serializeArray(params);
    }
    return functionalMessage(message);
}

const query = (msg: string) => {
    return functionalMessage(queryPrefix + msg);
}

const answer = (query: string, msg: string) => {
    return functionalMessage(answerPrefix + query.substring(2) + mainSeparator + msg);
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