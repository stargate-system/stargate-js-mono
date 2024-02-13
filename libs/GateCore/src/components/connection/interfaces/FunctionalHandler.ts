export interface FunctionalHandler {
    setConnected: (sendFunction: (message: string) => void) => void,
    close: () => void,
    createQuery: (keyword: string, timeout?: number, params?: string[]) => Promise<string>,
    addQueryListener: (keyword: string, onQuery: (respond: (response: string) => void, params?: string[]) => void) => void,
    removeQueryListener: (keyword: string) => void,
    addCommandListener: (command: string, onCommand: (params?: Array<string>) => void) => void;
    removeCommandListener: (command: string) => void,
    sendCommand: (keyword: string, params?: Array<string>) => void,
    handleFunctionalMessage: (message: string) => void
}