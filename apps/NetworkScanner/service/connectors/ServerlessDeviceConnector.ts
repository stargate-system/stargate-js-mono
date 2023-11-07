import {SocketWrapper, ConnectionState, Keywords, Manifest, ValueMessage} from "gate-core";
import {DeviceConnector} from "gate-router";

export class ServerlessDeviceConnector implements DeviceConnector{
    private static _nextId = 1;
    private readonly _id: string;
    private readonly _connection: SocketWrapper;
    private _manifest: Manifest | undefined;
    onValueMessage: (change: ValueMessage) => void = () => {};
    onStateChange: (state: ConnectionState) => void = () => {};

    constructor(socket: WebSocket) {
        this._id = ServerlessDeviceConnector._nextId.toString();
        ServerlessDeviceConnector._nextId++;
        this._connection = new SocketWrapper();
        // @ts-ignore
        const onMessageSetter = (messageHandler: (msg: string) => void) => socket.onmessage = (event) => {
            messageHandler(event.data);
        };
        const onCloseSetter = (closeHandler: () => void) => socket.onclose = closeHandler;
        this._connection.setConnected(
            socket.send.bind(socket),
            socket.close.bind(socket),
            onMessageSetter,
            onCloseSetter,
            (change: ValueMessage) => this.onValueMessage(change)
        )
        this._connection.addStateChangeListener((state) => {
            this.onStateChange(state);
        })
        this.performHandshake();
    }

    private performHandshake = async () => {
        const functionalHandler = this._connection.handler?.getFunctionalHandler();
        if (functionalHandler) {
            const manifestString = await functionalHandler
                .createQuery(Keywords.manifest)
                .catch(() => this._connection.close());
            if (manifestString !== undefined) {
                this._manifest = JSON.parse(manifestString);
                if (this._manifest) {
                    this._manifest.id = this._id;
                } else {
                    throw new Error('On performing handshake: received invalid manifest - ' + manifestString);
                }
                functionalHandler.sendCommand(Keywords.ready);
                this._connection.setState(ConnectionState.ready);
            }
        } else {
            throw new Error('On performing handshake: no functionalHandler');
        }
    }


    get connection(): SocketWrapper {
        return this._connection;
    }

    get manifest(): Manifest | undefined {
        return this._manifest;
    }

    handleValueMessage(valueMessage: ValueMessage): void {
        this._connection.handler?.sendValueMessage(valueMessage);
    }

    get id(): string {
        return this._id;
    };
}