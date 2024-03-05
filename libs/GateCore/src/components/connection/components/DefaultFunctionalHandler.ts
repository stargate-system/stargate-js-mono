import {Registry} from "../../Registry.js";
import {ConnectionConfig} from "../../../interfaces/ConnectionConfig.js";
import MessageMapper from "./MessageMapper.js";
import Markers from "../../../constants/Markers.js";
import {FunctionalHandler} from "../interfaces/FunctionalHandler.js";
import {Connection} from "../interfaces/Connection";

interface PendingQuery {
    resolveQuery: (value: string) => void,
    rejectQuery: (reason: string) => void
}

export class DefaultFunctionalHandler implements FunctionalHandler{
    private _sendFunction?: (message: string) => void;
    private readonly _pendingQueries = new Registry<PendingQuery>();
    private readonly _queryListeners = new Registry<(respond: (response: string) => void, params?: string[]) => void>();
    private readonly _commandListeners = new Registry<(params?: Array<string>) => void>();
    private readonly _queryTimeout: number;
    private readonly _connection: Connection;

    constructor(connection: Connection, config?: ConnectionConfig) {
        this._connection = connection;
        this._queryTimeout = config?.queryTimeout ?? 5000;
    }

    setConnected = (sendFunction: (message: string) => void) => {
        this._sendFunction = sendFunction;
    };

    close = () => {
        this._sendFunction = undefined;
        this._pendingQueries.getValues().forEach((pendingQuery) => pendingQuery.rejectQuery('Connection closed'));
        this._pendingQueries.clear();
    };

    createQuery = (keyword: string, timeout?: number, params?: string[]): Promise<string> => {
        if (!this._sendFunction) {
            throw new Error('Query creation failed: connection closed');
        }

        if (!this._pendingQueries.getByKey(keyword)) {
            let resolveQuery: (value: string) => void;
            let rejectQuery: (reason: string) => void;
            const result = new Promise<string>((resolve, reject) => {
                const timeoutKey = setTimeout(() => {
                    this._pendingQueries.remove(keyword);
                    reject('Query timeout');
                }, timeout ?? this._queryTimeout);
                resolveQuery = (value: string) => {
                    clearTimeout(timeoutKey);
                    resolve(value);
                }
                rejectQuery = (reason: string) => {
                    clearTimeout(timeoutKey);
                    reject(reason);
                }
            });
            // @ts-ignore
            this._pendingQueries.add({resolveQuery, rejectQuery}, keyword);
            const query = MessageMapper.query(keyword, params);
            this._sendFunction(query);
            return result;
        } else {
            throw new Error(`Query for ${keyword} already pending`);
        }
    };

    addQueryListener = (keyword: string, onQuery: (respond: (response: string) => void, params?: string[]) => void) => {
        this._queryListeners.add(onQuery, keyword);
    };

    removeQueryListener = (keyword: string) => {
        this._queryListeners.remove(keyword);
    };

    addCommandListener = (command: string, onCommand: (params?: Array<string>) => void) => {
        this._commandListeners.add(onCommand, command);
    };

    removeCommandListener = (command: string) => {
        this._commandListeners.remove(command);
    };

    sendCommand = (keyword: string, params?: Array<string>) => {
        if (this._sendFunction) {
            this._sendFunction(MessageMapper.command(keyword, params));
        }
    };

    sendPing = () => {
        if (this._sendFunction) {
            this._sendFunction(MessageMapper.ping());
        }
    };

    private handleQueryRequest = (queryMessage: string): string => {
        const separatorIndex = queryMessage.indexOf(Markers.mainSeparator);
        if (separatorIndex !== -1) {
            const keyword = queryMessage.substring(2, separatorIndex);
            const listener = this._queryListeners.getByKey(keyword);
            const [params, remainingMessage] = MessageMapper.parseArray(queryMessage.substring(separatorIndex + 1));
            if (listener) {
                const respond = (msg: string) => {
                    if (this._sendFunction) {
                        this._sendFunction(MessageMapper.answer(queryMessage, msg));
                    }
                };
                listener(respond, params);
            }
            return remainingMessage;
        } else {
            console.log('WARNING: query request malformed - ' + queryMessage);
            return '';
        }
    };

    private handleQueryResponse = (queryResponse: string): string => {
        const separatorIndex = queryResponse.indexOf(Markers.mainSeparator);
        const keyword = separatorIndex !== -1 ? queryResponse.substring(2, separatorIndex) : queryResponse.substring(2);
        const [responseContent, remainingMessage] = MessageMapper.parseArray(queryResponse.substring(separatorIndex + 1));
        const pendingQuery = this._pendingQueries.getByKey(keyword);
        if (pendingQuery) {
            pendingQuery.resolveQuery(responseContent.length ? responseContent[0] : '');
            this._pendingQueries.remove(keyword);
        }
        return remainingMessage;
    };

    private handleCommand = (commandMessage: string): string => {
        const separatorIndex = commandMessage.indexOf(Markers.mainSeparator);
        if (separatorIndex !== -1) {
            const keyword = separatorIndex !== -1 ? commandMessage.substring(2, separatorIndex) : commandMessage.substring(2);
            const listener = this._commandListeners.getByKey(keyword);
            const [params, remainingMessage] = MessageMapper.parseArray(commandMessage.substring(separatorIndex + 1));
            if (listener) {
                listener(params);
            }
            return remainingMessage;
        } else {
            console.log('WARNING: command malformed - ' + commandMessage);
            return '';
        }
    };

    private handleNoArguments = (message: string) => {
        return message.length > 2 ? message.substring(2) : '';
    };

    handleFunctionalMessage = (message: string) => {
        let isAcknowledge = false;
        let remainingMessage = message;
        while (remainingMessage.length) {
            if (remainingMessage.charAt(0) === Markers.functionalMessagePrefix) {
                switch (remainingMessage.charAt(1)) {
                    case Markers.ping:
                        remainingMessage = this.handleNoArguments(remainingMessage);
                        break;
                    case Markers.queryPrefix:
                        remainingMessage = this.handleQueryRequest(remainingMessage);
                        break;
                    case Markers.answerPrefix:
                        remainingMessage = this.handleQueryResponse(remainingMessage);
                        break;
                    case Markers.commandPrefix:
                        remainingMessage = this.handleCommand(remainingMessage);
                        break;
                    case Markers.acknowledge:
                        isAcknowledge = true;
                        remainingMessage = this.handleNoArguments(remainingMessage);
                        break;
                    default:
                        console.log('WARNING: unknown functional marker - ' + message.charAt(1));
                        remainingMessage = '';
                }
            } else {
                this._connection.handleValueMessage(remainingMessage);
                remainingMessage = '';
            }
        }
        if (isAcknowledge) {
            this._connection.outputBuffer.acknowledgeReceived();
        } else {
            this._connection.outputBuffer.sendAcknowledge();
        }
    };
}