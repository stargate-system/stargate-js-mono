const {Directions, GateDevice, ConnectionState} = require('@stargate-system/device');
const {factory} = GateDevice;

const SETTINGS_KEY = 'settings';

let settings = {
    inputMin: 0,
    inputMax: 1,
    outputMin: 0,
    outputMax: 1,
    invert: false
};

// Creating necessary GateValues
const inputMin = factory.createFloat(Directions.input);
inputMin.valueName = 'Input min';

const inputMax = factory.createFloat(Directions.input);
inputMax.valueName = 'Input max';

const input = factory.createFloat(Directions.input);
input.valueName = 'Input';

const outputMin = factory.createFloat(Directions.input);
outputMin.valueName = 'Output min';

const outputMax = factory.createFloat(Directions.input);
outputMax.valueName = 'Output max';

const output = factory.createFloat(Directions.output);
output.valueName = 'Output';

const invert = factory.createBoolean(Directions.input);
invert.valueName = 'Invert';

// Defining function that will perform conversion
const convert = () => {
    const inputRange = inputMax.value - inputMin.value;
    let inputRelative = (input.value - inputMin.value) / inputRange;
    if (inputRelative > 1) {
        inputRelative = 1;
    } else if (inputRelative < 0) {
        inputRelative = 0;
    }
    const outputRange = outputMax.value - outputMin.value;
    const outputValue = invert.value
        ? (outputMax.value - outputRange * inputRelative)
        : (outputMin.value + outputRange * inputRelative);
    output.setValue(outputValue);
}

// Setting callbacks on GateValues
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
invert.onRemoteUpdate = () => {
    settings.invert = invert.value;
    saveSettings();
    convert();
}

// Defining auxiliary functions
const applySettings = () => {
    inputMin.setValue(settings.inputMin);
    inputMax.setValue(settings.inputMax);
    outputMin.setValue(settings.outputMin);
    outputMax.setValue(settings.outputMax);
    invert.setValue(settings.invert);
}

const saveSettings = () => {
    GateDevice.ServerStorage.set(SETTINGS_KEY, JSON.stringify(settings));
}

// Configuring device
applySettings();
GateDevice.setName('Range converter');
GateDevice.state.onStateChange = (state) => {
    // Fetching saved device settings on startup
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
        // Removing callback after device initialization
        GateDevice.state.onStateChange = undefined;
    }
};

GateDevice.start();
