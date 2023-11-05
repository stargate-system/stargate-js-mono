import {Directions, GateDevice, ValueFactory, logger, ConnectionState} from 'gate-device';

const testOut = ValueFactory.createInteger(Directions.output, 'test out', [0, 10]);
GateDevice.setDeviceName('Test device');
const connection = GateDevice.startDevice();
let interval;
let counter = 0;
connection.addStateChangeListener(() => {
    logger.logInfo('Connection state: ' + connection.state);
    switch (connection.state) {
        case ConnectionState.ready:
            interval = setInterval(() => {
                testOut.setValue(counter++);
            }, 1000);
            break;
        case ConnectionState.closed:
            clearInterval(interval);
    }
});
logger.logInfo('Waiting for connection...');

