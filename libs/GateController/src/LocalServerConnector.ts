import {SystemConnector} from "gate-viewmodel";
import {
    ConnectionState, ConnectionType, CoreConfig,
    DefaultConnection,
    EventName, GateValue,
    Keywords, SocketWrapper,
    SubscriptionBuffer,
    SystemImage,
    ValueMessage
} from "gate-core";
import config from "../config";

export class LocalServerConnector implements SystemConnector {
    private static readonly ws = typeof window === 'undefined' ? import('ws') : undefined;
    private static readonly discovery = typeof window === 'undefined' ? import('gate-discovery') : undefined;
    private _isClosed = false;
    private readonly _connection;
    private readonly _subscriptionBuffer;
    private readonly _config;

    onJoinEvent: (systemImage: SystemImage, connectedDevices: Array<string>) => void = () => {};
    onDeviceEvent?: (event: EventName, data: string[]) => void;
    onValueMessage?: (message: ValueMessage) => void;
    readonly subscribe: (id: string) => void;
    readonly unsubscribe: (id: string) => void;
    readonly addStateChangeListener: (callback: (state: ConnectionState) => void) => string;
    readonly removeStateChangeListener: (listenerKey: string) => void;

    constructor(customConfig?: Object) {
        if (customConfig) {
            this._config = {
                ...config,
                ...customConfig
            };
        } else {
            this._config = {...config};
        }
        this._connection = new DefaultConnection(true, this._config);
        this.addStateChangeListener = this._connection.addStateChangeListener;
        this.removeStateChangeListener = this._connection.removeStateChangeListener;
        this._subscriptionBuffer = new SubscriptionBuffer(
            (subscribed) => this._connection.functionalHandler
                .sendCommand(Keywords.subscribe, subscribed),
            (unsubscribed) => this._connection.functionalHandler
                .sendCommand(Keywords.unsubscribe, unsubscribed)
        );
        this.subscribe = this._subscriptionBuffer.subscribe;
        this.unsubscribe = this._subscriptionBuffer.unsubscribe;
        this._connection.addStateChangeListener((state) => {
            if (state === ConnectionState.closed) {
                this.handleConnectionClosed();
            }
        });

        this._connection.functionalHandler.addCommandListener(Keywords.joinData, (params) => {
            if (params) {
                const systemImage = JSON.parse(params[0]);
                const activeDevices = params.slice(1);
                this.onJoinEvent(systemImage, activeDevices);
                this._connection.setReady();
            } else {
                this._connection.close();
            }
        });

        this._connection.functionalHandler.addCommandListener(EventName.deviceConnected, (params) => {
            if (params && this.onDeviceEvent) {
                this.onDeviceEvent(EventName.deviceConnected, params);
            }
        });

        this._connection.functionalHandler.addCommandListener(EventName.deviceDisconnected, (params) => {
            if (params && this.onDeviceEvent) {
                this.onDeviceEvent(EventName.deviceDisconnected, params);
            }
        });

        this._connection.functionalHandler.addCommandListener(EventName.deviceRemoved, (params) => {
            if (params && this.onDeviceEvent) {
                this.onDeviceEvent(EventName.deviceRemoved, params);
            }
        });

        this._connection.functionalHandler.addCommandListener(EventName.deviceRenamed, (params) => {
            if (params && this.onDeviceEvent) {
                this.onDeviceEvent(EventName.deviceRenamed, params);
            }
        });

        this._connection.functionalHandler.addCommandListener(EventName.pipeCreated, (params) => {
            if (params && this.onDeviceEvent) {
                this.onDeviceEvent(EventName.pipeCreated, params);
            }
        });

        this._connection.functionalHandler.addCommandListener(EventName.pipeRemoved, (params) => {
            if (params && this.onDeviceEvent) {
                this.onDeviceEvent(EventName.pipeRemoved, params);
            }
        });

        this._connection.onValueMessage = (valueMessage) => {
            if (this.onValueMessage) {
                this.onValueMessage(valueMessage);
            }
        }
    }

    get state(): ConnectionState {
        return this._connection.state;
    }

    joinSystem = () => {
        this._isClosed = false;
        if (this._connection.state !== ConnectionState.closed) {
            this._connection.close();
        }
        if (typeof window !== 'undefined') {
            let serverAddress;
            if (this._config.useFixedUrl) {
                serverAddress = this._config.fixedUrl;
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                serverAddress = window.location.hostname + ':' + (urlParams.get('connectionPort') ?? CoreConfig.connectionPort);
            }
            this.connectBrowser(serverAddress);
        } else {
            if (this._config.useFixedUrl) {
                this.connectWs(this._config.fixedUrl);
            } else {
                LocalServerConnector.discovery?.then(discovery => {
                    discovery.DefaultDiscoveryService.executeWhenServerFound(this._config.discoveryKeyword, this.connectWs);
                });
            }
        }
    }

    sendValue = (gateValue: GateValue<any>) => {
        this._connection.sendGateValue(gateValue);
    }

    disconnect = () => {
        this._isClosed = true;
        this._connection.close();
    }

    sendDeviceEvent = (event: string, params: string[]) => {
        this._connection.functionalHandler.sendCommand(event, params);
    }

    readonly getCurrentPing = () => this._connection.ping;

    private handleConnectionClosed = () => {
        if (!this._isClosed) {
            setTimeout(() => {
                if (this._connection.state === ConnectionState.closed && !this._isClosed) {
                    this.joinSystem();
                }
            }, 5000);
        }
    }

    private connect = (socketWrapper: SocketWrapper) => {
        this._connection.setConnected(socketWrapper);
        this._connection.functionalHandler.addQueryListener(Keywords.type, (respond) => {
            respond(ConnectionType.controller);
            this._connection.functionalHandler.removeQueryListener(Keywords.type);
        });
    }

    private connectBrowser = (serverAddress: string) => {
        const socket = new WebSocket('ws://' + serverAddress);
        socket.onclose = this.handleConnectionClosed;
        socket.onopen = () => {
            const socketWrapper: SocketWrapper = {
                send: socket.send.bind(socket),
                close: socket.close.bind(socket),
                setOnClose: (callback: () => void) => {
                    socket.onclose = callback;
                },
                setOnMessage: (callback: (message: string) => void) => {
                    socket.onmessage = (ev) => callback(ev.data);
                }
            };
            this.connect(socketWrapper);
        }
    }

    private connectWs = (serverAddress: string) => {
        LocalServerConnector.ws?.then((ws) => {
            const socket = new ws.WebSocket('ws://' + serverAddress);
            socket.on('close', this.handleConnectionClosed);
            socket.on('error', console.log);
            socket.onopen = () => {
                const socketWrapper: SocketWrapper = {
                    send: socket.send.bind(socket),
                    close: socket.close.bind(socket),
                    setOnClose: (callback) => socket.on('close', callback),
                    setOnMessage: (callback) => socket.on('message', (ev: any) => callback(ev.toString()))
                }
                this.connect(socketWrapper);
            };
        });
    }
}