import {
    ConnectionState,
    ConnectionType,
    CoreConfig,
    DefaultConnection,
    GateValue,
    Keywords,
    SocketWrapper
} from "gate-core";
import {SystemConnector} from "gate-viewmodel";
import {EventName, SubscriptionBuffer} from "gate-core";

const connection = new DefaultConnection(true);
const subscriptionBuffer = new SubscriptionBuffer(
    (subscribed) => connection.functionalHandler.sendCommand(Keywords.subscribe, subscribed),
    (unsubscribed) => connection.functionalHandler.sendCommand(Keywords.unsubscribe, unsubscribed)
);

connection.addStateChangeListener((state) => {
    LocalServerConnector.state = state;
    if (state === ConnectionState.closed) {
        handleConnectionClosed();
    }
});

connection.functionalHandler.addCommandListener(Keywords.joinData, (params) => {
    if (params) {
        const systemImage = JSON.parse(params[0]);
        const activeDevices = params.slice(1);
        LocalServerConnector.onJoinEvent(systemImage, activeDevices);
        connection.setReady();
    } else {
        connection.close();
    }
})

connection.functionalHandler.addCommandListener(EventName.deviceConnected, (params) => {
    if (params && LocalServerConnector.onDeviceEvent) {
        LocalServerConnector.onDeviceEvent(EventName.deviceConnected, params);
    }
});

connection.functionalHandler.addCommandListener(EventName.deviceDisconnected, (params) => {
    if (params && LocalServerConnector.onDeviceEvent) {
        LocalServerConnector.onDeviceEvent(EventName.deviceDisconnected, params);
    }
});

connection.functionalHandler.addCommandListener(EventName.deviceRemoved, (params) => {
    if (params && LocalServerConnector.onDeviceEvent) {
        LocalServerConnector.onDeviceEvent(EventName.deviceRemoved, params);
    }
});

connection.functionalHandler.addCommandListener(EventName.deviceRenamed, (params) => {
    if (params && LocalServerConnector.onDeviceEvent) {
        LocalServerConnector.onDeviceEvent(EventName.deviceRenamed, params);
    }
});

connection.functionalHandler.addCommandListener(EventName.pipeCreated, (params) => {
    if (params && LocalServerConnector.onDeviceEvent) {
        LocalServerConnector.onDeviceEvent(EventName.pipeCreated, params);
    }
});

connection.functionalHandler.addCommandListener(EventName.pipeRemoved, (params) => {
    if (params && LocalServerConnector.onDeviceEvent) {
        LocalServerConnector.onDeviceEvent(EventName.pipeRemoved, params);
    }
});

connection.onValueMessage = (valueMessage) => {
    if (LocalServerConnector.onValueMessage) {
        LocalServerConnector.onValueMessage(valueMessage);
    }
}

const joinSystem = () => {
    if (connection.state !== ConnectionState.closed) {
        connection.close();
    }
    if (typeof window !== 'undefined') {
        console.log('Connecting...');
        const urlParams = new URLSearchParams(window.location.search);
        const socket = new WebSocket('ws://' + window.location.hostname + ':' + (urlParams.get('connectionPort') ?? CoreConfig.connectionPort));
        socket.onclose = handleConnectionClosed;
        socket.onopen = () => {
            console.log('Socket opened');
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
            connection.setConnected(socketWrapper);
            connection.functionalHandler.addQueryListener(Keywords.type, (respond) => {
                respond(ConnectionType.controller);
                connection.functionalHandler.removeQueryListener(Keywords.type);
            });
        }
    }
}

const handleConnectionClosed = () => {
    console.log('Connection closed');
    setTimeout(joinSystem, 5000);
}

const sendValue = (gateValue: GateValue<any>) => {
    connection.sendGateValue(gateValue);
}

const disconnect = () => connection.close();

const sendDeviceEvent = (event: string, params: string[]) => {
    connection.functionalHandler.sendCommand(event, params);
}

const LocalServerConnector: SystemConnector = {
    onJoinEvent: () => {},
    sendValue,
    state: ConnectionState.closed,
    subscribe: subscriptionBuffer.subscribe,
    unsubscribe: subscriptionBuffer.unsubscribe,
    joinSystem,
    addStateChangeListener: connection.addStateChangeListener,
    removeStateChangeListener: connection.removeStateChangeListener,
    disconnect,
    getCurrentPing: () => connection.ping,
    sendDeviceEvent
}

export default LocalServerConnector;
