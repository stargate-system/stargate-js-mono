import ApiCommons from "./ApiCommons.js";

const {
    mainSeparator,
    auxSeparator,
    functionalMessagePrefix,
    infoPrefix,
    queryPrefix,
    answerPrefix
} = ApiCommons.Markers;

const serialize = (messageMap) => {
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

const parse = (message) => {
    const firstSeparator = message.indexOf(mainSeparator);
    const secondSeparator = message.indexOf(mainSeparator, firstSeparator + 1);
    const ids = message.slice(0, firstSeparator).split(auxSeparator);
    const lengths = message.slice(firstSeparator + 1, secondSeparator).split(auxSeparator).map((val) => Number.parseInt(val));
    const messagesString = message.slice(secondSeparator + 1);
    if (lengths.reduce((a, b) => a + b) !== messagesString.length) {
        throw new Error('Messages length inconsistent with declared');
    }
    const messages = [];
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
    const result = [];
    ids.forEach((id, index) => {
        result.push([id, messages[index]]);
    });
    return result;
}

const functionalMessage = (msg) => {
    return functionalMessagePrefix + msg;
}

const info = (msg) => {
    return functionalMessage(infoPrefix + msg);
}

const query = (msg) => {
    return functionalMessage(queryPrefix + msg);
}

const answer = (query, msg) => {
    return functionalMessage(answerPrefix + query.substring(2) + ApiCommons.Markers.mainSeparator + msg);
}

export default {
    serialize,
    parse,
    functionalMessage,
    info,
    query,
    answer
}