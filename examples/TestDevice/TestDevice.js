import {Directions, GateDevice} from 'gate-device';
const {ValueFactory} = GateDevice;

const smallInteger = ValueFactory.createInteger(Directions.output, 'Small integer', [0, 200]);
const bigInteger = ValueFactory.createInteger(Directions.output, 'Big integer', [-5000, 50000]);
const unlimitedInteger = ValueFactory.createInteger(Directions.output, 'Unlimited integer');

const increment = ValueFactory.createInteger(Directions.input, 'Increment amount', [1, 10]);
increment.onRemoteUpdate = () => incrementValue = increment.value;

const frequency = ValueFactory.createFloat(Directions.input, 'Frequency', [1, 100]);
frequency.setValue(4.5);

const testBool = ValueFactory.createBoolean(Directions.output, 'Counter direction', 'Positive', 'Negative');
testBool.setValue(true);

const countRunning = ValueFactory.createBoolean(Directions.input, 'Counter', 'Running', 'Stopped');
countRunning.onRemoteUpdate = () => {
    if (countRunning.value) {
        alterValue();
    }
}

GateDevice.setDeviceName('Test device');
const deviceState = GateDevice.startDevice();

deviceState.onStateChange = (state) => {
    console.log('Connection state: ' + state);
};
console.log('Waiting for connection...');

let dir = 1;
let incrementValue = increment.value;
let counter = 0;

const alterValue = () => {
    if (counter > smallInteger.settings.range[1]) {
        dir = -1;
        testBool.setValue(false);
    } else if (counter < smallInteger.settings.range[0]) {
        dir = 1;
        testBool.setValue(true);
    }
    counter += dir * incrementValue;
    // logger.info('Set to: ' + counter);
    smallInteger.setValue(counter);
    bigInteger.setValue(counter * 200);
    unlimitedInteger.setValue(counter);
    if (countRunning.value) {
        setTimeout(() => alterValue(), 1000 / frequency.value);
    }
}

alterValue();
