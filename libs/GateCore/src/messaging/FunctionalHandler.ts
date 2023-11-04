import {Registry} from "../components/Registry.js";
import MessageMapper from "./MessageMapper.js";
import {Markers} from "./ApiCommons";

export class FunctionalHandler {
    private readonly sendFunction: (message: string) => void;
    private readonly pendingQueries = new Registry<(value: string) => void>();
    private readonly queryListeners = new Registry<(respond: (response: string) => void) => void>();
    private readonly commandListeners = new Registry<(params?: Array<string>) => void>();
    private readonly queryTimeout: number;

    constructor(sendFunction: (message: string) => void, queryTimeout?: number) {
        this.sendFunction = sendFunction;
        this.queryTimeout = queryTimeout ?? 5000;
    }

    createQuery(keyword: string): Promise<string> {
        if (!this.pendingQueries.getByKey(keyword)) {
            let resolveFunction: (value: string) => void;
            const result = new Promise<string>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.pendingQueries.remove(keyword);
                    reject('Timeout');
                }, this.queryTimeout);
                resolveFunction = (value: string) => {
                    clearTimeout(timeout);
                    resolve(value);
                }
            });
            // @ts-ignore
            this.pendingQueries.add(resolveFunction, keyword);
            const query = MessageMapper.query(keyword);
            this.sendFunction(query);
            return result;
        } else {
            throw new Error(`Query for ${keyword} already pending`);
        }
    }

    addQueryListener(keyword: string, onQuery: (respond: (response: string) => void) => void) {
        this.queryListeners.add(onQuery, keyword);
    }

    removeQueryListener(keyword: string) {
        this.queryListeners.remove(keyword);
    }

    addCommandListener(command: string, onCommand: (params?: Array<string>) => void) {
        return this.commandListeners.add(onCommand, command);
    }

    removeInfoListener(command: string) {
        this.commandListeners.remove(command);
    }

    sendCommand(keyword: string) {
        this.sendFunction(MessageMapper.command(keyword));
    }

     private handleQueryRequest(queryMessage: string) {
        const keyword = queryMessage.substring(2);
        const listener = this.queryListeners.getByKey(keyword);
        if (listener) {
            const respond = (msg: string) => this.sendFunction(MessageMapper.answer(queryMessage, msg));
            listener(respond);
        }
    }

    private handleQueryResponse(queryResponse: string) {
        const separatorIndex = queryResponse.indexOf(Markers.mainSeparator);
        const keyword = separatorIndex !== -1 ? queryResponse.substring(2, separatorIndex) : queryResponse.substring(2);
        const listener = this.pendingQueries.getByKey(keyword);
        if (listener) {
            listener(queryResponse.substring(separatorIndex + 1));
            this.pendingQueries.remove(keyword);
        }
    }

    private handleCommand(commandMessage: string) {
        const separatorIndex = commandMessage.indexOf(Markers.mainSeparator);
        const keyword = separatorIndex !== -1 ? commandMessage.substring(2, separatorIndex) : commandMessage.substring(2);
        const listener = this.commandListeners.getByKey(keyword);
        if (listener) {
            if (separatorIndex !== -1) {
                const params = MessageMapper.parseArray(commandMessage.substring(separatorIndex + 1));
                listener(params);
            } else {
                listener();
            }
        }
    }

    onFunctionalMessage(message: string) {
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