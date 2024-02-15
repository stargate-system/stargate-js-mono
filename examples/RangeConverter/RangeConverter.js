const {Directions, GateDevice, ValueVisibility, ConnectionState} = require('gate-device');
const {ValueFactory} = GateDevice;

const SETTINGS_KEY = 'settings';

let settings = {
    inputMin: 0,
    inputMax: 1,
    outputMin: 0,
    outputMax: 1
};

const applySettings = () => {
    inputMin.setValue(settings.inputMin);
    inputMax.setValue(settings.inputMax);
    outputMin.setValue(settings.outputMin);
    outputMax.setValue(settings.outputMax);
}

const saveSettings = () => {
    GateDevice.ServerStorage.set(SETTINGS_KEY, JSON.stringify(settings));
}

const inputMin = ValueFactory.createFloat(Directions.input);
inputMin.valueName = 'Input min';
inputMin.visibility = ValueVisibility.settings;

const inputMax = ValueFactory.createFloat(Directions.input);
inputMax.valueName = 'Input max';
inputMax.visibility = ValueVisibility.settings;

const input = ValueFactory.createFloat(Directions.input);
input.valueName = 'Input';

const outputMin = ValueFactory.createFloat(Directions.input);
outputMin.valueName = 'Output min';
outputMin.visibility = ValueVisibility.settings;

const outputMax = ValueFactory.createFloat(Directions.input);
outputMax.valueName = 'Output max';
outputMax.visibility = ValueVisibility.settings;

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

applySettings();
GateDevice.setName('Range converter');
const deviceState = GateDevice.start();
deviceState.onStateChange = (state) => {
    if (state === ConnectionState.ready) {
        GateDevice.ServerStorage.get(SETTINGS_KEY).then((result) => {
            if (result !== undefined) {
                try {
                    settings = JSON.parse(result);
                    applySettings();
                } catch (err) {
                    console.log(err, result);
                }
            }
        });
        deviceState.onStateChange = undefined;
    }
};
