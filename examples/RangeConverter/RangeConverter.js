const {Directions, GateDevice} = require('gate-device');
const {ValueFactory} = GateDevice;
const fs = require('fs');

const FILENAME = 'settings.json';

let settings = {
    inputMin: 0,
    inputMax: 1,
    outputMin: 0,
    outputMax: 1
};

try {
    settings = JSON.parse(fs.readFileSync(FILENAME).toString());
} catch (err) {}

let saveFlag = false;

const saveSettings = () => {
    if (!saveFlag) {
        saveFlag = true;
        setTimeout(() => {
            saveFlag = false;
            fs.writeFile(FILENAME, JSON.stringify(settings), (err) => {
                if (err) {
                    console.log('On saving settings', err);
                }
            });
        }, 2000);
    }
}

const inputMin = ValueFactory.createFloat(Directions.input);
inputMin.valueName = 'Input min';
inputMin.setValue(settings.inputMin);

const inputMax = ValueFactory.createFloat(Directions.input);
inputMax.valueName = 'Input max';
inputMax.setValue(settings.inputMax);

const input = ValueFactory.createFloat(Directions.input);
input.valueName = 'Input';

const outputMin = ValueFactory.createFloat(Directions.input);
outputMin.valueName = 'Output min';
outputMin.setValue(settings.outputMin);

const outputMax = ValueFactory.createFloat(Directions.input);
outputMax.valueName = 'Output max';
outputMax.setValue(settings.outputMax);

const output = ValueFactory.createFloat(Directions.output);
output.valueName = 'Output';

const convert = () => {
    const inputRange = inputMax.value - inputMin.value;
    let inputRelative = (input.value - inputMin.value) / inputRange;
    if (inputRelative > 1) {
        inputRelative = 1;
    } else if (inputRelative < 0) {
        inputRelative = 0;
    }
    const outputRange = outputMax.value - outputMin.value;
    output.setValue(outputMin.value + outputRange * inputRelative);
}

inputMin.onRemoteUpdate = () => {
    settings.inputMin = inputMin.value;
    saveSettings();
    convert();
}
inputMax.onRemoteUpdate = () => {
    settings.inputMax = inputMax.value;
    saveSettings();
    convert();
};
input.onRemoteUpdate = convert;

outputMin.onRemoteUpdate = () => {
    settings.outputMin = outputMin.value;
    saveSettings();
    convert();
};
outputMax.onRemoteUpdate = () => {
    settings.outputMax = outputMax.value;
    saveSettings();
    convert();
};
output.onRemoteUpdate = convert;

GateDevice.setName('Range converter');
GateDevice.start();
