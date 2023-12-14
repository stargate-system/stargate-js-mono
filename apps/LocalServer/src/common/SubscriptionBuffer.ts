export class SubscriptionBuffer {
    private _buffer = new Map<string, boolean>();
    private readonly _bufferDelay: number;
    private _bufferTimeout: NodeJS.Timeout | undefined;
    private readonly _sendSubscribed: (subscribed: string[]) => void;
    private readonly _sendUnsubscribed: (unsubscribed: string[]) => void;

    constructor(sendSubscribed: (subscribed: string[]) => void,
                sendUnsubscribed: (unsubscribed: string[]) => void,
                bufferDelay?: number) {
        this._sendSubscribed = sendSubscribed;
        this._sendUnsubscribed = sendUnsubscribed;
        this._bufferDelay = bufferDelay !== undefined ? bufferDelay : 100;
    }

    subscribe = (id: string) => {
        this._buffer.set(id, true);
        this._flushLater();
    }

    unsubscribe = (id: string) => {
        this._buffer.set(id, false);
        this._flushLater();
    }

    private _clear = () => {
        this._buffer = new Map<string, boolean>();
        if (this._bufferTimeout) {
            clearTimeout(this._bufferTimeout);
            this._bufferTimeout = undefined;
        }
    }

    private _flushLater = () => {
        if (!this._bufferTimeout) {
            this._bufferTimeout = setTimeout(() => {
                const subscribedIds: string[] = [];
                const unsubscribedIds: string[] = [];
                this._buffer.forEach((subscribed, id) => {
                    if (subscribed) {
                        subscribedIds.push(id);
                    } else {
                        unsubscribedIds.push(id);
                    }
                });
                if (subscribedIds.length) {
                    this._sendSubscribed(subscribedIds);
                }
                if (unsubscribedIds.length) {
                    this._sendUnsubscribed(unsubscribedIds);
                }
                this._clear();
            }, this._bufferDelay);
        }
    }
}