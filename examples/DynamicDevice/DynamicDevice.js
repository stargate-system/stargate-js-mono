const {
    GateDevice,
    Directions,
    ValueVisibility
} = require('@stargate-system/device');
const {ValueTypes} = require("@stargate-system/core");

GateDevice.setName('Dynamic device');

const valueName = GateDevice.factory.createString(Directions.input);
valueName.valueName = 'New value name';
valueName.visibility = ValueVisibility.settings;

const valueType = GateDevice.factory.createSelect(Directions.input);
valueType.valueName = 'New value type';
valueType.visibility = ValueVisibility.settings;
valueType.values = [ValueTypes.boolean, ValueTypes.string, ValueTypes.float].map((value) => value.toString());

const addValue = GateDevice.factory.createBoolean(Directions.input);
addValue.valueName = 'Add';
addValue.visibility = ValueVisibility.settings;
addValue.isButton = true;
addValue.labelFalse = '+';

addValue.onRemoteUpdate = () => {
    if (addValue.value) {
        GateDevice.stop();
        addValue.setValue(false);
        let newValue;
        switch (valueType.value) {
            case 0:
                newValue = GateDevice.factory.createBoolean(Directions.input);
                break;
            case 1:
                newValue = GateDevice.factory.createString(Directions.input);
                break;
            case 2:
                newValue = GateDevice.factory.createFloat(Directions.input);
                break;
        }
        if (newValue) {
            newValue.valueName = valueName.value;
        }
        GateDevice.start();
    }
}

GateDevice.start();
