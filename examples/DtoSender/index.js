const {GateDevice, Directions, ValueVisibility} = require('@stargate-system/device');

GateDevice.setName('DTO Sender');
GateDevice.setGroup('Test devices');

const settingsDto = {
    frequency: 1,
    increment: 1
}

const selectedOption = GateDevice.ValueFactory.createSelect(Directions.input);
selectedOption.valueName = 'Mode';
selectedOption.values = ['Slow', 'Medium', 'High'];

const setButton = GateDevice.ValueFactory.createBoolean(Directions.input);
setButton.isButton = true;
setButton.labelFalse = 'Set';

const dto = GateDevice.ValueFactory.createString(Directions.output);
dto.valueName = 'ModeDTO';
dto.visibility = ValueVisibility.hidden;

setButton.onRemoteUpdate = () => {
    if (setButton.value) {
        switch (selectedOption.value) {
            case 0:
                settingsDto.frequency = 1;
                settingsDto.increment = 1;
                break;
            case 1:
                settingsDto.frequency = 10;
                settingsDto.increment = 2;
                break;
            case 2:
                settingsDto.frequency = 100;
                settingsDto.increment = 10;
                break;
        }
        dto.setValue(JSON.stringify(settingsDto), false);
    }
}

GateDevice.start();