import {Directions, GateDevice, ValueFactory, logger, ConnectionState} from 'gate-device';

const testOut = ValueFactory.createInteger(Directions.output, 'test out', [0, 3]);
GateDevice.setDeviceName('Test device');
const connection = GateDevice.startDevice();
let interval;
let incrementValue = 1;
let counter = 0;

const alterValue = () => {
    if (counter > testOut.maximum + 2) {
        incrementValue = -1;
    } else if (counter < testOut.minimum - 2) {
        incrementValue = 1;
    }
    counter += incrementValue;
    // logger.logInfo('Set to: ' + counter);
    testOut.setValue(counter);
}

connection.addStateChangeListener(() => {
    logger.logInfo('Connection state: ' + connection.state);
    switch (connection.state) {
        case ConnectionState.ready:
            interval = setInterval(() => {
                alterValue();
            }, 1000);
            break;
        case ConnectionState.closed:
            clearInterval(interval);
    }
});
logger.logInfo('Waiting for connection...');

