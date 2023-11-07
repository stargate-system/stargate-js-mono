import {Directions, ConnectionState, GateDevice} from 'gate-device';
const {logger, ValueFactory} = GateDevice;

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
    logger.info('Set to: ' + counter);
    testOut.setValue(counter);
}

connection.addStateChangeListener((state) => {
    logger.info('Connection state: ' + state);
    switch (state) {
        case ConnectionState.ready:
            interval = setInterval(alterValue, 1000);
            break;
        case ConnectionState.closed:
            clearInterval(interval);
    }
});
logger.info('Waiting for connection...');

