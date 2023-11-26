import {Registry} from "../../Registry.js";
import {ConnectionConfig} from "../../../api/ConnectionConfig.js";
import MessageMapper from "./MessageMapper.js";
import Markers from "../constants/Markers.js";
import {FunctionalHandler} from "../interfaces/FunctionalHandler.js";

interface PendingQuery {
    resolveQuery: (value: string) => void,
    rejectQuery: (reason: string) => void
}

export class DefaultFunctionalHandler implements FunctionalHandler{
    private _sendFunction?: (message: string) => void;
    private readonly _pendingQueries = new Registry<PendingQuery>();
    private readonly _queryListeners = new Registry<(respond: (response: string) => void) => void>();
    private readonly _commandListeners = new Registry<(params?: Array<string>) => void>();
    private readonly _queryTimeout: number;

    constructor(config?: ConnectionConfig) {
        this._queryTimeout = config?.queryTimeout ?? 5000;
    }

    setConnected = (sendFunction: (message: string) => void) => {
        this._sendFunction = sendFunction;
    }

    close = () => {
        this._sendFunction = undefined;
        this._pendingQueries.getValues().forEach((pendingQuery) => pendingQuery.rejectQuery('Connection closed'));
    }

    createQuery = (keyword: string): Promise<string> => {
        if (!this._sendFunction) {
            throw new Error('Query creation failed: connection closed');
        }

        if (!this._pendingQueries.getByKey(keyword)) {
            let resolveQuery: (value: string) => void;
            let rejectQuery: (reason: string) => void;
            const result = new Promise<string>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this._pendingQueries.remove(keyword);
                    reject('Query timeout');
                }, this._queryTimeout);
                resolveQuery = (value: string) => {
                    clearTimeout(timeout);
                    resolve(value);
                }
                rejectQuery = (reason: string) => {
                    clearTimeout(timeout);
                    reject(reason);
                }
            });
            // @ts-ignore
            this._pendingQueries.add({resolveQuery, rejectQuery}, keyword);
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
        if (this._sendFunction) {
            this._sendFunction(MessageMapper.command(keyword, params));
        }
    }

    private handleQueryRequest = (queryMessage: string) => {
        const keyword = queryMessage.substring(2);
        const listener = this._queryListeners.getByKey(keyword);
        if (listener) {
            const respond = (msg: string) => {
                if (this._sendFunction) {
                    this._sendFunction(MessageMapper.answer(queryMessage, msg));
                }
            };
            listener(respond);
        }
    }

    private handleQueryResponse = (queryResponse: string) => {
        const separatorIndex = queryResponse.indexOf(Markers.mainSeparator);
        const keyword = separatorIndex !== -1 ? queryResponse.substring(2, separatorIndex) : queryResponse.substring(2);
        const pendingQuery = this._pendingQueries.getByKey(keyword);
        if (pendingQuery) {
            pendingQuery.resolveQuery(queryResponse.substring(separatorIndex + 1));
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