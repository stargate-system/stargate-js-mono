const {
    GateDevice,
    Directions
} = require('@stargate-system/device');

GateDevice.setName('Local device');
GateDevice.setInfo('LocalDevice custom id');
GateDevice.setGroup('Test devices');
GateDevice.state.onStateChange = (state) => {
    console.log('State: ' + state);
}

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

GateDevice.start();
console.log('Waiting for connection...');