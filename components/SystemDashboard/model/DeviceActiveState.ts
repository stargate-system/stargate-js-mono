import {ObservableNode} from "./ObservableNode";

export class DeviceActiveState extends ObservableNode {
    private _isActive: boolean;

    constructor(isActive: boolean) {
        super();
        this._isActive = isActive;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    readonly setIsActive = (isActive: boolean) => {
        this._isActive = isActive;
        this._notify();
    }
}