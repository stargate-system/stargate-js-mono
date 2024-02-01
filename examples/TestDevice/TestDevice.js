const {Directions, GateDevice} = require('gate-device');
const {ValueFactory} = GateDevice;

const smallInteger = ValueFactory.createInteger(Directions.output);
smallInteger.valueName = 'Small integer';
smallInteger.setRange([0, 200]);

const bigInteger = ValueFactory.createInteger(Directions.output);
bigInteger.valueName = 'Big integer';
bigInteger.setRange([-5000, 50000]);

const unlimitedInteger = ValueFactory.createInteger(Directions.output);
unlimitedInteger.valueName = 'Unlimited integer';

const increment = ValueFactory.createInteger(Directions.input);
increment.valueName = 'Increment amount';
increment.setRange([1, 10]);
increment.onRemoteUpdate = () => incrementValue = increment.value;

const frequency = ValueFactory.createFloat(Directions.input);
frequency.valueName = 'Frequency';
frequency.setRange([1, 100]);
frequency.setValue(4.5);

const testBool = ValueFactory.createBoolean(Directions.output);
testBool.valueName = 'Counter direction';
testBool.labelTrue = 'Positive';
testBool.labelFalse = 'Negative';
testBool.setValue(true);

const countRunning = ValueFactory.createBoolean(Directions.input, 'Counter', 'Running', 'Stopped');
countRunning.valueName = 'Counter';
countRunning.labelTrue = 'Running';
countRunning.labelFalse = 'Stopped';
const onCountChange = () => {
    if (countRunning.value) {
        alterValue();
    }
}
countRunning.onRemoteUpdate = onCountChange;
countRunning.onLocalUpdate = onCountChange;

const testStringOut = ValueFactory.createString(Directions.output);
testStringOut.valueName = 'Test text';
testStringOut.minimumLength = 20;

const testStringIn = ValueFactory.createString(Directions.input);
testStringIn.valueName = 'Test command';
testStringIn.onRemoteUpdate = () => {
    switch (testStringIn.value) {
        case 'stop':
            countRunning.setValue(false);
            testStringOut.setValue('Stopped by command');
            break;
        case 'start':
            countRunning.setValue(true);
            testStringOut.setValue('Started by command');
            break;
        case 'longword':
            testStringOut.setValue('Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz');
            break;
        default:
            testStringOut.setValue('Unknown command received. Allowed commands are only "start", "stop" and "longword"');
    }
}

GateDevice.setName('Test device');
GateDevice.setGroup('Test devices');
const deviceState = GateDevice.start();

deviceState.onStateChange = (state) => {
    console.log('Connection state: ' + state);
};
console.log('Waiting for connection...');

let dir = 1;
let incrementValue = increment.value;
let counter = 0;

const alterValue = () => {
    if (counter > smallInteger.range[1]) {
        dir = -1;
        testBool.setValue(false);
        testStringOut.setValue('Counter runs reverse');
    } else if (counter < smallInteger.range[0]) {
        dir = 1;
        testBool.setValue(true);
        testStringOut.setValue('Counter runs forward');
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
