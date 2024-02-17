const {Directions, GateDevice} = require('gate-device');
const {ValueVisibility} = require("gate-core");
const {ValueFactory} = GateDevice;

GateDevice.setName('Test device');
GateDevice.setGroup('Test devices');

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
increment.visibility = ValueVisibility.settings;
increment.setRange([1, 10]);

const frequency = ValueFactory.createFloat(Directions.input);
frequency.valueName = 'Frequency';
frequency.visibility = ValueVisibility.settings;
frequency.setRange([1, 100]);
frequency.setValue(4.5);

const testBool = ValueFactory.createBoolean(Directions.output);
testBool.valueName = 'Counter direction';
testBool.labelTrue = 'Positive';
testBool.labelFalse = 'Negative';
testBool.setValue(true);

const directionSelectOutput = ValueFactory.createSelect(Directions.output);
directionSelectOutput.valueName = 'Counter direction';
directionSelectOutput.values = ['Positive', 'Negative'];
directionSelectOutput.setValue(0);

const countRunning = ValueFactory.createBoolean(Directions.input);
countRunning.valueName = 'Counter';
countRunning.labelTrue = 'Running';
countRunning.labelFalse = 'Stopped';

const runCounter = ValueFactory.createBoolean(Directions.input);
runCounter.valueName = 'Run counter';
runCounter.labelFalse = 'Run';
runCounter.isButton = true;
runCounter.onRemoteUpdate = (wasChanged) => {
    if (wasChanged) {
        countRunning.setValue(runCounter.value);
    }
}

const testSelect = ValueFactory.createSelect(Directions.input);
testSelect.valueName = 'Counted values';
testSelect.visibility = 'settings';
testSelect.nothingSelectedLabel = 'None';
testSelect.values = ['Small integer', 'Big integer', 'Unlimited integer', 'All'];
testSelect.setSelectedOption('All');

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

const modeDtoInput = GateDevice.ValueFactory.createString(Directions.input);
modeDtoInput.valueName = 'ModeDTO';
modeDtoInput.visibility = ValueVisibility.hidden;
modeDtoInput.onRemoteUpdate = () => {
    try {
        const dto = JSON.parse(modeDtoInput.value);
        if (dto?.frequency) {
            frequency.setValue(dto.frequency);
        }
        if (dto?.increment) {
            increment.setValue(dto.increment);
        }
    } catch (err) {}
}

const deviceState = GateDevice.start();

deviceState.onStateChange = (state) => {
    console.log('Connection state: ' + state);
};
console.log('Waiting for connection...');

let dir = 1;
let counter = 0;

const alterValue = () => {
    if (counter > smallInteger.range[1]) {
        dir = -1;
        testBool.setValue(false);
        directionSelectOutput.setSelectedOption('Negative');
        testStringOut.setValue('Counter runs reverse');
    } else if (counter < smallInteger.range[0]) {
        dir = 1;
        testBool.setValue(true);
        directionSelectOutput.setSelectedOption('Positive');
        testStringOut.setValue('Counter runs forward');
    }
    counter += dir * increment.value;
    switch (testSelect.value) {
        case 0:
            smallInteger.setValue(counter);
            break;
        case 1:
            bigInteger.setValue(counter * 200);
            break;
        case 2:
            unlimitedInteger.setValue(counter);
            break;
        case 3:
            smallInteger.setValue(counter);
            bigInteger.setValue(counter * 200);
            unlimitedInteger.setValue(counter);
            break;
    }

    if (countRunning.value) {
        setTimeout(() => alterValue(), 1000 / frequency.value);
    }
}

alterValue();
