export interface ServerStorage {
    get: (directory: string, key: string) => Promise<string | undefined>,
    set: (directory: string, key: string, value: string) => void,
    append: (directory: string, key: string, value: string) => void,
    remove: (directory: string, key?: string, logError?: boolean) => void
}