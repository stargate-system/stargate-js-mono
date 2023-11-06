import {Connection, ConnectionState, Keywords, ValueMessage} from "gate-core";

export class ServerlessConnector {
    private readonly _connection: Connection;
    private _manifest: Object | undefined;
    onValueMessage: (change: ValueMessage) => void;

    constructor(socket: WebSocket) {
        this._connection = new Connection();
        this.onValueMessage = () => {};
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
                functionalHandler.sendCommand(Keywords.ready);
                this._connection.setState(ConnectionState.ready);
            }
        } else {
            throw new Error('On performing handshake: no functionalHandler');
        }
    }


    get connection(): Connection {
        return this._connection;
    }

    get manifest(): Object | undefined {
        return this._manifest;
    }
}