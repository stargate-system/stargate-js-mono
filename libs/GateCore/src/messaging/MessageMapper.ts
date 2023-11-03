import {Markers} from "./ApiCommons";

const {
    mainSeparator,
    auxSeparator,
    functionalMessagePrefix,
    commandPrefix,
    queryPrefix,
    answerPrefix
} = Markers;

const serialize = (messageMap: Object) => {
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
    })
    return ids.slice(0, -1) + mainSeparator + lengths.slice(0, -1) + mainSeparator + messages;
}

const parse = (message: string): Array<[string, string]> => {
    const firstSeparator = message.indexOf(mainSeparator);
    const secondSeparator = message.indexOf(mainSeparator, firstSeparator + 1);
    const ids = message.slice(0, firstSeparator).split(auxSeparator);
    const lengths = message.slice(firstSeparator + 1, secondSeparator).split(auxSeparator).map((val) => Number.parseInt(val));
    const messagesString = message.slice(secondSeparator + 1);
    if (lengths.reduce((a, b) => a + b) !== messagesString.length) {
        throw new Error('Messages length inconsistent with declared');
    }
    const messages: Array<string> = [];
    let currentIndex = 0;
    let nextIndex;
    lengths.forEach((length) => {
        nextIndex = currentIndex + length;
        messages.push(messagesString.substring(currentIndex, nextIndex));
        currentIndex = nextIndex;
    });
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

const command = (msg: string) => {
    return functionalMessage(commandPrefix + msg);
}

const query = (msg: string) => {
    return functionalMessage(queryPrefix + msg);
}

const answer = (query: string, msg: string) => {
    return functionalMessage(answerPrefix + query.substring(2) + mainSeparator + msg);
}

export default {
    serialize,
    parse,
    functionalMessage,
    command,
    query,
    answer
}