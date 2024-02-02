const {
    GateDevice,
    Directions
} = require('gate-device');

GateDevice.setName('Test local');
GateDevice.setGroup('Test devices');

const testBool = GateDevice.ValueFactory.createBoolean(Directions.input);
testBool.valueName = 'Test bool';
testBool.onRemoteUpdate = () => console.log('>>> value', testBool.value);
testBool.isButton = true;
testBool.labelFalse = '>>';
testBool.labelTrue = 'Running...'

const testNum = GateDevice.ValueFactory.createInteger(Directions.output);
testNum.valueName = 'Test int';
testNum.setRange([-10, 10]);

let dir = 1;
setInterval(() => {
    if (testNum.value === testNum.range[1]) {
        dir = -1;
    } else if (testNum.value === testNum.range[0]) {
        dir = 1;
    }
    testNum.setValue(testNum.value + dir);
}, 200);

const state = GateDevice.start();
state.onStateChange = (state) => {
    console.log('State: ' + state);
}
console.log('Waiting for connection...');