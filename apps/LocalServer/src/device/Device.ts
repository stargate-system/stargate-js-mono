import {DeviceConnector} from "./DeviceConnector";
import {
    Connection,
    ConnectionState,
    Keywords,
    ValueMessage,
    SubscriptionBuffer,
    ValidManifest,
    EventName,
    AddressMapper
} from "gate-core";
import ControllerContext from "../controller/ControllerContext";
import DeviceContext from "../device/DeviceContext";
import {ValueMessageConsumer} from "../common/ValueMessageConsumer";

export class Device {
    private readonly _id: string;
    private readonly _manifest: ValidManifest;
    private readonly _connection: Connection;
    private readonly _subscriptions = new Map<string, Map<string, ValueMessageConsumer>>();
    private readonly _subscriptionBuffer: SubscriptionBuffer

    constructor(connector: DeviceConnector) {
        if (!connector.id || !connector.manifest) {
            connector.connection.close();
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
                ControllerContext.forwardDeviceEvent(EventName.deviceDisconnected, [this._id]);
                console.log("Disconnected: " + this._id);
            }
        });
        this._connection.onValueMessage = this._routeDeviceMessage;
        try {
            DeviceContext.deviceRegistry.add(this, this._id);
            this._connection.functionalHandler.sendCommand(Keywords.ready);
            this._connection.setReady();
            ControllerContext.forwardDeviceEvent(EventName.deviceConnected, [JSON.stringify(this._manifest)]);
        } catch (err) {
            this._connection.close();
            throw new Error('Failed registering device: ' + err);
        }
        console.log("Connected: " + this._id);
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
            this._subscriptionBuffer.subscribe(subscribedValueId);
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

    unsubscribeConsumer = (consumerId: string) => {
        this._subscriptions.forEach((map, valueId) => {
            if (map.has(consumerId)) {
                map.delete(consumerId);
                if (map.size === 0) {
                    this._subscriptionBuffer.unsubscribe(valueId);
                }
            }
        });
    }

    private readonly _routeDeviceMessage = (valueMessage: ValueMessage) => {
        const receiversMap = new Map<string, [ValueMessageConsumer, ValueMessage]>
        valueMessage.forEach((change) => {
            const [valueId, message] = change;
            const idWithParent = AddressMapper.appendParentId(this._id, valueId);
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
        receiversMap.forEach((value) => {
            value[0].sendValueMessage(value[1]);
        });
    }
}