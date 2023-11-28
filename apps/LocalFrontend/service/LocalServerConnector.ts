import {ConnectionState, CoreConfig, DefaultConnection, GateValue, Keywords, SocketWrapper} from "gate-core";
import {SystemConnector} from "gate-viewmodel";
import {EventName, SubscriptionBuffer, ValidManifest} from "gate-router";

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
        const manifest = JSON.parse(params[0]) as ValidManifest;
        LocalServerConnector.onDeviceEvent(EventName.deviceConnected, manifest);
    }
});

connection.functionalHandler.addCommandListener(EventName.deviceDisconnected, (params) => {
    if (params && LocalServerConnector.onDeviceEvent) {
        LocalServerConnector.onDeviceEvent(EventName.deviceDisconnected, params[0]);
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
        const socket = new WebSocket('ws://' + window.location.hostname + ':' + CoreConfig.localServerControllerPort);
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
    getCurrentPing: () => connection.ping
}

export default LocalServerConnector;
