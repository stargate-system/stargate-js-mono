import {DeviceConnector} from "../../api/DeviceConnector";
import {Connection, ConnectionState, Keywords, ValueMessage} from "gate-core";
import ControllerContext from "../controllerContext/ControllerContext";
import {EventName} from "../../constants/EventName";
import DeviceContext from "./DeviceContext";
import {ValidManifest} from "../../interfaces/ValidManifest";
import {ValueMessageConsumer} from "../../interfaces/ValueMessageConsumer";
import {SubscriptionBuffer} from "../SubscriptionBuffer";
import Router from "../../api/Router";

export class Device {
    private readonly _id: string;
    private readonly _manifest: ValidManifest;
    private readonly _connection: Connection;
    private readonly _subscriptions = new Map<string, Map<string, ValueMessageConsumer>>();
    private readonly _subscriptionBuffer: SubscriptionBuffer

    constructor(connector: DeviceConnector) {
        if (!connector.id || !connector.manifest) {
            throw new Error('On creating device: connector has incomplete data');
        }
        this._subscriptionBuffer = new SubscriptionBuffer(
            (subscribed) => this._connection.functionalHandler.sendCommand(Keywords.subscribe, subscribed),
            (unsubscribed) => this._connection.functionalHandler.sendCommand(Keywords.unsubscribe, unsubscribed)
        );
        this._id = connector.id;
        this._manifest = connector.manifest;
        this._manifest.values.forEach((value) => {
            this._subscriptions.set(value.id, new Map<string, ValueMessageConsumer>)
        });
        this._connection = connector.connection;
        this._connection.addStateChangeListener((state) => {
            if (state === ConnectionState.closed) {
                DeviceContext.deviceRegistry.remove(this._id);
                ControllerContext.forwardDeviceEvent(EventName.disconnected, this);
            }
        });
        this._connection.onValueMessage = this._routeDeviceMessage;
        this._connection.functionalHandler.sendCommand(Keywords.ready);
        this._connection.setReady();
        DeviceContext.deviceRegistry.add(this, this._id);
        ControllerContext.forwardDeviceEvent(EventName.connected, this);
    }

    get id(): string {
        return this._id;
    }

    get manifest(): ValidManifest {
        return this._manifest;
    }

    sendValue = (value: [string, string]) => {
        if (this._connection.state === ConnectionState.ready) {
            this._connection.sendValue(value);
        }
    }

    subscribe = (subscribedValueId: string, consumer: ValueMessageConsumer) => {
        const subscribers = this._subscriptions.get(subscribedValueId);
        if (subscribers) {
            if (subscribers.size === 0) {
                this._subscriptionBuffer.subscribe(subscribedValueId);
            }
            subscribers.set(consumer.id, consumer);
        }
    }

    unsubscribe = (unsubscribedValueId: string, consumerId: string) => {
        const subscribers = this._subscriptions.get(unsubscribedValueId);
        if (subscribers) {
            subscribers.delete(consumerId);
            if (subscribers.size === 0) {
                this._subscriptionBuffer.unsubscribe(unsubscribedValueId);
            }
        }
    }

    private readonly _routeDeviceMessage = (valueMessage: ValueMessage) => {
        const receiversMap = new Map<string, [ValueMessageConsumer, ValueMessage]>
        valueMessage.forEach((change) => {
            const [valueId, message] = change;
            const idWithParent = Router.appendParentId(this._id, valueId);
            const receivers = this._subscriptions.get(valueId);
            if (receivers) {
                receivers.forEach((consumer, consumerId) => {
                    let receiver = receiversMap.get(consumerId);
                    if (receiver) {
                        receiver[1].push([idWithParent, message]);
                    } else {
                        receiver = [consumer, [[idWithParent, message]]];
                        receiversMap.set(consumerId, receiver);
                    }
                });
            }
        });
        receiversMap.forEach((value) => value[0].sendValueMessage(value[1]));
    }
}