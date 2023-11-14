export interface SocketWrapper {
    send: (message: string) => void,
    close: () => void;
    setOnClose: (onCloseCallback: () => void) => void;
    setOnMessage: (onMessageCallback: (message: string) => void) => void
}