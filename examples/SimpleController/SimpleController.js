const {GateDevice, Directions} = require('gate-device');
const {getSystemModel} = require('gate-controller');
const {MapEventName, DeviceState} = require("gate-viewmodel");

GateDevice.setName('Simple controller');

const testDeviceState = GateDevice.ValueFactory.createBoolean(Directions.output);
testDeviceState.valueName = 'Test device';
testDeviceState.labelTrue = 'Online';
testDeviceState.labelFalse = 'Offline';

const incrementAmount = GateDevice.ValueFactory.createInteger(Directions.input);
incrementAmount.valueName = 'Increment amount';
incrementAmount.setRange([1, 10]);
incrementAmount.onRemoteUpdate = () => {
    if (observedValue) {
        observedValue.gateValue.setValue(incrementAmount.value);
    }
}

GateDevice.start();

const systemModel = getSystemModel();
let observedDevice;
let observedValue;

const initObservedDevice = () => {
    if (observedDevice) {
        testDeviceState.setValue(observedDevice.state.value === DeviceState.up);
        observedDevice.state.subscribe(() => testDeviceState.setValue(observedDevice.state.value === DeviceState.up));
        observedValue = observedDevice.gateValues.values.find((value) => value.name === incrementAmount.valueName);
        if (observedValue) {
            observedValue.value.subscribe(() => {
                incrementAmount.setValue(observedValue.gateValue.value)
            });
        }
    }
}

systemModel.devices.subscribe((ev) => {
    if (observedDevice) {
        if (ev.id === observedDevice.id) {
            if (ev.name === MapEventName.removed) {
                observedDevice = undefined;
                observedValue = undefined;
            } else {
                observedDevice = systemModel.devices.getById(observedDevice.id);
                initObservedDevice();
            }
        }
    } else {
        observedDevice = systemModel.devices.values.find((model) => model.name.value === testDeviceState.valueName);
        initObservedDevice();
    }
});

