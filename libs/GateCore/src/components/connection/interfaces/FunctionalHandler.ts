export interface FunctionalHandler {
    setConnected: (sendFunction: (message: string) => void) => void,
    close: () => void,
    createQuery: (keyword: string, timeout?: number) => Promise<string>,
    addQueryListener: (keyword: string, onQuery: (respond: (response: string) => void) => void) => void,
    removeQueryListener: (keyword: string) => void,
    addCommandListener: (command: string, onCommand: (params?: Array<string>) => void) => void;
    removeCommandListener: (command: string) => void,
    sendCommand: (keyword: string, params?: Array<string>) => void,
    handleFunctionalMessage: (message: string) => void
}