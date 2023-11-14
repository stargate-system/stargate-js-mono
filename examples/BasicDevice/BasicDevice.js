import {Directions, GateDevice} from 'gate-device';
const {logger, ValueFactory} = GateDevice;

const smallInteger = ValueFactory.createInteger(Directions.output, 'Small integer', [0, 200]);
const bigInteger = ValueFactory.createInteger(Directions.output, 'Big integer', [-5000, 50000]);
const unlimitedInteger = ValueFactory.createInteger(Directions.output, 'Unlimited integer');

const increment = ValueFactory.createInteger(Directions.input, 'Increment amount', [1, 10]);
increment.onRemoteUpdate = (value) => incrementValue = value ?? incrementValue;

const frequency = ValueFactory.createFloat(Directions.input, 'Frequency', [1, 100]);
frequency.setValue(4.5);

GateDevice.setDeviceName('Test device');
const deviceState = GateDevice.startDevice();

deviceState.onStateChange = (state) => {
    logger.info('Connection state: ' + state);
};
logger.info('Waiting for connection...');

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
    setTimeout(() => alterValue(), 1000 / frequency.value);
}

alterValue();
