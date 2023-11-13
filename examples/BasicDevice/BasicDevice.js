import {Directions, ConnectionState, GateDevice} from 'gate-device';
const {logger, ValueFactory} = GateDevice;

const smallInteger = ValueFactory.createInteger(Directions.output, 'Small integer', [0, 200]);
const bigInteger = ValueFactory.createInteger(Directions.output, 'Big integer', [-5000, 50000]);
const unlimitedInteger = ValueFactory.createInteger(Directions.output, 'Unlimited integer');

const increment = ValueFactory.createInteger(Directions.input, 'Increment amount', [1, 100]);
increment.onRemoteUpdate = (value) => incrementValue = value ?? incrementValue;

const frequency = ValueFactory.createFloat(Directions.input, 'Frequency', [1, 10]);
frequency.setValue(4.5);
frequency.onRemoteUpdate = () => {
    if (interval) {
        clearInterval(interval);
        interval = setInterval(alterValue, 1000 / frequency.value);
    }
}

const unlimitedInput = ValueFactory.createFloat(Directions.input, 'Unlimited float');

GateDevice.setDeviceName('Test device');
const connection = GateDevice.startDevice();

let interval;
let dir = 1;
let incrementValue = increment.value;
let counter = 0;

const alterValue = () => {
    if (counter > smallInteger.maximum) {
        dir = -1;
    } else if (counter < smallInteger.minimum) {
        dir = 1;
    }
    counter += dir * incrementValue;
    // logger.info('Set to: ' + counter);
    smallInteger.setValue(counter);
    bigInteger.setValue(counter * 200);
    unlimitedInteger.setValue(counter);
}

connection.addStateChangeListener((state) => {
    logger.info('Connection state: ' + state);
    switch (state) {
        case ConnectionState.ready:
            interval = setInterval(alterValue, 1000 / frequency.value);
            break;
        case ConnectionState.closed:
            clearInterval(interval);
    }
});
logger.info('Waiting for connection...');

