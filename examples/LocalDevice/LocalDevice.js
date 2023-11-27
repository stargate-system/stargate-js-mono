const {
    GateDevice,
    Directions
} = require('gate-device');

GateDevice.setDeviceName('Test local');
const testBool = GateDevice.ValueFactory.createBoolean(Directions.input, 'Test bool');
testBool.onRemoteUpdate = () => console.log('>>> value', testBool.value);

const testNum = GateDevice.ValueFactory.createInteger(Directions.output, 'Test int', [-10, 10]);

let dir = 1;
setInterval(() => {
    if (testNum.value === testNum.settings.range[1]) {
        dir = -1;
    } else if (testNum.value === testNum.settings.range[0]) {
        dir = 1;
    }
    testNum.setValue(testNum.value + dir);
}, 200);

const state = GateDevice.startDevice();
state.onStateChange = (state) => {
    console.log('State: ' + state);
}
console.log('Waiting for connection...');