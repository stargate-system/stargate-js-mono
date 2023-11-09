import {Directions, ConnectionState, GateDevice} from 'gate-device';
const {logger, ValueFactory} = GateDevice;

const testInteger = ValueFactory.createInteger(Directions.output, 'Test integer', [0, 5]);
// const testBool = ValueFactory.createBoolean(Directions.output, "Out of range");
GateDevice.setDeviceName('Test device');
const connection = GateDevice.startDevice();
let interval;
let incrementValue = 1;
let counter = 0;

const alterValue = () => {
    if (counter > testInteger.maximum) {
        incrementValue = -1;
    } else if (counter < testInteger.minimum) {
        incrementValue = 1;
    }
    counter += incrementValue;
    logger.info('Set to: ' + counter);
    testInteger.setValue(counter);
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

