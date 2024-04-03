const {GateDevice, Directions} = require('@stargate-system/device');
const {getSystemModel} = require('@stargate-system/controller');
const {DeviceState, DeviceSubscription} = require("@stargate-system/model");

// Exposing output as device - just for demonstration purposes (use of Device together with Controller is optional)
GateDevice.setName('Simple controller');

const observedDeviceState = GateDevice.ValueFactory.createBoolean(Directions.output);
observedDeviceState.valueName = 'Observed device';
observedDeviceState.labelTrue = 'Online';
observedDeviceState.labelFalse = 'Offline';

GateDevice.start();

// Getting system model
const systemModel = getSystemModel();

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

// Subscribing desired device on system model
// Searching device by value of "info" field, defined in device code
const testDeviceSubscription = new DeviceSubscription(
    systemModel,
    (deviceModel) => deviceModel.info.value === 'SimpleController custom id',
    (deviceModel) => bindStateWithOutput(deviceModel, observedDeviceState)
);

// Keeping subscription active only when observedDeviceState has listeners (subscription is open on creation)
if (!observedDeviceState.subscribed) {
    testDeviceSubscription.close();
}
observedDeviceState.onSubscriptionChange = (subscribed) => {
    subscribed ? testDeviceSubscription.open() : testDeviceSubscription.close();
}

