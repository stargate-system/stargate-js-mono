const {GateDevice, Directions} = require('gate-device');
const {getSystemModel} = require('gate-controller');
const {DeviceState, DeviceSubscription} = require("gate-viewmodel");

// Exposing output as device - just for demonstration purposes (use of GateDevice together with GateController is optional)
GateDevice.setName('Simple controller');

const localDeviceState = GateDevice.ValueFactory.createBoolean(Directions.output);
localDeviceState.valueName = 'Local device';
localDeviceState.labelTrue = 'Online';
localDeviceState.labelFalse = 'Offline';

GateDevice.start();

// Getting system model
const systemModel = getSystemModel();

// Subscribing desired device on system model
// Searching device by value of "info" field, defined in device code
const bindStateWithOutput = (deviceModel, output) => {
    if (deviceModel) {
        output.setValue(deviceModel.state.value === DeviceState.up);
        deviceModel.state.subscribe(() => {
            output.setValue(deviceModel.state.value === DeviceState.up);
        });
    } else {
        output.setValue(false);
    }
};

const testDeviceSubscription = new DeviceSubscription(
    systemModel,
    (deviceModel) => deviceModel.info.value === 'LocalDevice custom id',
    (deviceModel) => bindStateWithOutput(deviceModel, localDeviceState)
);

// Keeping subscription active only when testDeviceState has listeners (subscription is open on creation)
if (!localDeviceState.subscribed) {
    testDeviceSubscription.close();
}
localDeviceState.onSubscriptionChange = (subscribed) => {
    subscribed ? testDeviceSubscription.open() : testDeviceSubscription.close();
}

