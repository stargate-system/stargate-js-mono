const {
    GateDevice,
    Directions,
    ValueVisibility
} = require('gate-device');
const {ValueTypes} = require("gate-core");

GateDevice.setName('Dynamic device');

const valueName = GateDevice.ValueFactory.createString(Directions.input);
valueName.valueName = 'New value name';
valueName.visibility = ValueVisibility.settings;

const valueType = GateDevice.ValueFactory.createSelect(Directions.input);
valueType.valueName = 'New value type';
valueType.visibility = ValueVisibility.settings;
valueType.values = [ValueTypes.boolean, ValueTypes.string, ValueTypes.float].map((value) => value.toString());

const addValue = GateDevice.ValueFactory.createBoolean(Directions.input);
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
                newValue = GateDevice.ValueFactory.createBoolean(Directions.input);
                break;
            case 1:
                newValue = GateDevice.ValueFactory.createString(Directions.input);
                break;
            case 2:
                newValue = GateDevice.ValueFactory.createFloat(Directions.input);
                break;
        }
        if (newValue) {
            newValue.valueName = valueName.value;
        }
        GateDevice.start();
    }
}

GateDevice.start();
