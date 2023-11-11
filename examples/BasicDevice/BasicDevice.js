import {Directions, ConnectionState, GateDevice} from 'gate-device';
const {logger, ValueFactory} = GateDevice;

const smallInteger = ValueFactory.createInteger(Directions.output, 'Small integer', [0, 200]);
const bigInteger = ValueFactory.createInteger(Directions.output, 'Big integer', [-5000, 50000]);
const unlimitedInteger = ValueFactory.createInteger(Directions.output, 'Unlimited integer');
const inputNumber = ValueFactory.createInteger(Directions.input, 'Increment amount', [1, 100]);
inputNumber.onRemoteUpdate = (value) => incrementValue = value ?? incrementValue;
GateDevice.setDeviceName('Test device');
const connection = GateDevice.startDevice();

let interval;
let incrementValue = 1;
let counter = 0;

const alterValue = () => {
    if (counter > smallInteger.maximum) {
        incrementValue = -1;
    } else if (counter < smallInteger.minimum) {
        incrementValue = 1;
    }
    counter += incrementValue;
    // logger.info('Set to: ' + counter);
    smallInteger.setValue(counter);
    bigInteger.setValue(counter * 200);
    unlimitedInteger.setValue(counter);
}

connection.addStateChangeListener((state) => {
    logger.info('Connection state: ' + state);
    switch (state) {
        case ConnectionState.ready:
            interval = setInterval(alterValue, 300);
            break;
        case ConnectionState.closed:
            clearInterval(interval);
    }
});
logger.info('Waiting for connection...');

