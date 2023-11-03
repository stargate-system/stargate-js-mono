export class Device {
    _id: string;
    _manifest: string | undefined;
    _socketHandler: Object | undefined

    constructor(id: string) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    get manifest() {
        return this._manifest;
    }

    get socketHandler() {
        return this._socketHandler;
    }

    set manifest(value) {
        this._manifest = value;
    }

    set socketHandler(value) {
        this._socketHandler = value;
    }
}