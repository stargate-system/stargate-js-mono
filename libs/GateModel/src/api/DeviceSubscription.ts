import {SystemModel} from "./SystemModel";
import {DeviceModel} from "../components/DeviceModel/DeviceModel";
import {MapEventName} from "../components/ModelMap/MapEventName";

export class DeviceSubscription {
    private readonly _systemModel: SystemModel;
    private readonly _matcher: (device: DeviceModel) => boolean;
    private _subscriptionKey?: string;
    private _deviceModel?: DeviceModel;
    onModelUpdate?: (newModel?: DeviceModel) => void;

    constructor(systemModel: SystemModel, matcher: (device: DeviceModel) => boolean, onModelUpdate?: (newModel?: DeviceModel) => void) {
        this._systemModel = systemModel;
        this._matcher = matcher;
        this.onModelUpdate = onModelUpdate;
        this.open();
    }

    get deviceModel(): DeviceModel | undefined {
        return this._deviceModel;
    }

    open = () => {
        if (this._subscriptionKey === undefined) {
            this._deviceModel = this._systemModel.devices.find(this._matcher);
            if (this.onModelUpdate) {
                this.onModelUpdate(this._deviceModel);
            }
            this._subscriptionKey = this._systemModel.devices.subscribe((event) => {
                if (!this._deviceModel && event.name !== MapEventName.removed) {
                    this._deviceModel = this._systemModel.devices.find(this._matcher);
                    if (this._deviceModel && this.onModelUpdate) {
                        this.onModelUpdate(this._deviceModel);
                    }
                } else if (event.id === this._deviceModel?.id) {
                    if (event.name === MapEventName.removed) {
                        this._deviceModel = undefined;
                        if (this.onModelUpdate) {
                            this.onModelUpdate(undefined);
                        }
                    } else {
                        this._deviceModel = this._systemModel.devices.getById(event.id);
                        if (this.onModelUpdate) {
                            this.onModelUpdate(this._deviceModel);
                        }
                    }
                }
            });
        }
    }

    close = () => {
        if (this._subscriptionKey !== undefined) {
            this._systemModel.devices.unsubscribe(this._subscriptionKey);
            this._subscriptionKey = undefined;
        }
    }
}