import {Registry} from "../api/commonComponents/Registry.js";
import MessageMapper from "./MessageMapper.js";
import Markers from "./Markers.js";
import {FunctionalHandler} from "./api/FunctionalHandler.js";

export class FunctionalHandlerImpl implements FunctionalHandler{
    private readonly _sendFunction: (message: string) => void;
    private readonly _pendingQueries = new Registry<(value: string) => void>();
    private readonly _queryListeners = new Registry<(respond: (response: string) => void) => void>();
    private readonly _commandListeners = new Registry<(params?: Array<string>) => void>();
    private readonly _queryTimeout: number;

    constructor(sendFunction: (message: string) => void, queryTimeout?: number) {
        this._sendFunction = sendFunction;
        this._queryTimeout = queryTimeout ?? 5000;
    }

    createQuery = (keyword: string): Promise<string> => {
        if (!this._pendingQueries.getByKey(keyword)) {
            let resolveFunction: (value: string) => void;
            const result = new Promise<string>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this._pendingQueries.remove(keyword);
                    reject('Timeout');
                }, this._queryTimeout);
                resolveFunction = (value: string) => {
                    clearTimeout(timeout);
                    resolve(value);
                }
            });
            // @ts-ignore
            this._pendingQueries.add(resolveFunction, keyword);
            const query = MessageMapper.query(keyword);
            this._sendFunction(query);
            return result;
        } else {
            throw new Error(`Query for ${keyword} already pending`);
        }
    }

    addQueryListener = (keyword: string, onQuery: (respond: (response: string) => void) => void) => {
        this._queryListeners.add(onQuery, keyword);
    }

    removeQueryListener = (keyword: string) => {
        this._queryListeners.remove(keyword);
    }

    addCommandListener = (command: string, onCommand: (params?: Array<string>) => void) => {
        this._commandListeners.add(onCommand, command);
    }

    removeCommandListener = (command: string) => {
        this._commandListeners.remove(command);
    }

    sendCommand = (keyword: string, params?: Array<string>) => {
        this._sendFunction(MessageMapper.command(keyword, params));
    }

     private handleQueryRequest = (queryMessage: string) => {
        const keyword = queryMessage.substring(2);
        const listener = this._queryListeners.getByKey(keyword);
        if (listener) {
            const respond = (msg: string) => this._sendFunction(MessageMapper.answer(queryMessage, msg));
            listener(respond);
        }
    }

    private handleQueryResponse = (queryResponse: string) => {
        const separatorIndex = queryResponse.indexOf(Markers.mainSeparator);
        const keyword = separatorIndex !== -1 ? queryResponse.substring(2, separatorIndex) : queryResponse.substring(2);
        const listener = this._pendingQueries.getByKey(keyword);
        if (listener) {
            listener(queryResponse.substring(separatorIndex + 1));
            this._pendingQueries.remove(keyword);
        }
    }

    private handleCommand = (commandMessage: string) => {
        const separatorIndex = commandMessage.indexOf(Markers.mainSeparator);
        const keyword = separatorIndex !== -1 ? commandMessage.substring(2, separatorIndex) : commandMessage.substring(2);
        const listener = this._commandListeners.getByKey(keyword);
        if (listener) {
            if (separatorIndex !== -1) {
                const params = MessageMapper.parseArray(commandMessage.substring(separatorIndex + 1));
                listener(params);
            } else {
                listener();
            }
        }
    }

    handleFunctionalMessage = (message: string) => {
        switch (message.toString().charAt(1)) {
            case Markers.queryPrefix:
                this.handleQueryRequest(message);
                break;
            case Markers.answerPrefix:
                this.handleQueryResponse(message);
                break;
            case Markers.commandPrefix:
                this.handleCommand(message);
                break;
        }
    };
}