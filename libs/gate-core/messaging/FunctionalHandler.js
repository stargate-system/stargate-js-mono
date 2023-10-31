import {Registry} from "./Registry.js";
import config from "../config.js";
import MessageMapper from "./MessageMapper.js";
import ApiCommons from "./ApiCommons.js";

export class FunctionalHandler {
    #sendFunction;
    #pendingQueries = new Registry();
    #queryListeners = new Registry();
    #infoListeners = new Registry();

    constructor(sendFunction) {
        this.#sendFunction = sendFunction;
    }

    createQuery(keyword) {
        if (!this.#pendingQueries.getByKey(keyword)) {
            let resolveFunction;
            const result = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.#pendingQueries.remove(keyword);
                    reject('Timeout');
                }, config.queryTimeout);
                resolveFunction = (value) => {
                    clearTimeout(timeout);
                    resolve(value);
                }
            });
            this.#pendingQueries.add(resolveFunction, keyword);
            const query = MessageMapper.query(keyword);
            this.#sendFunction(query);
            return result;
        } else {
            throw new Error(`Query for ${keyword} already pending`);
        }
    }

    addQueryListener(keyword, onQuery) {
        this.#queryListeners.add(onQuery, keyword);
    }

    removeQueryListener(keyword) {
        this.#queryListeners.remove(keyword);
    }

    addInfoListener(onInfo) {
        return this.#infoListeners.add(onInfo);
    }

    removeInfoListener(key) {
        this.#infoListeners.remove(key);
    }

    sendInfo(keyword) {
        this.#sendFunction(MessageMapper.info(keyword));
    }

    #handleQueryRequest(queryMessage) {
        const keyword = queryMessage.substring(2);
        const listener = this.#queryListeners.getByKey(keyword);
        if (listener) {
            const respond = (msg) => this.#sendFunction(MessageMapper.answer(queryMessage, msg));
            listener(respond);
        }
    }

    #handleQueryResponse(queryResponse) {
        const separatorIndex = queryResponse.indexOf(ApiCommons.Markers.mainSeparator);
        const keyword = queryResponse.substring(2, separatorIndex);
        const listener = this.#pendingQueries.getByKey(keyword);
        if (listener) {
            listener(queryResponse.substring(separatorIndex + 1));
            this.#pendingQueries.remove(keyword);
        }
    }

    #handleInfo(infoMessage) {
        this.#infoListeners.getValues().forEach((listener) => {
            listener(infoMessage.substring(2));
        })
    }

    onFunctionalMessage(message) {
        switch (message.toString().charAt(1)) {
            case ApiCommons.Markers.queryPrefix:
                this.#handleQueryRequest(message);
                break;
            case ApiCommons.Markers.answerPrefix:
                this.#handleQueryResponse(message);
                break;
            case ApiCommons.Markers.infoPrefix:
                this.#handleInfo(message);
                break;
        }
    };
}