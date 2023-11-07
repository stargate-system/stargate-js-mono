export interface Logger {
    info: (message: string) => void,
    warning: (message: string) => void,
    error: (message: string) => void
}