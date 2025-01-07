"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = require("@stargate-system/device");
// @ts-ignore
const pigpio_1 = require("pigpio");
const init = () => {
    const led = new pigpio_1.Gpio(4, { mode: pigpio_1.Gpio.OUTPUT });
    led.digitalWrite(0);
    const light = device_1.GateDevice.factory.createBoolean(device_1.Directions.input);
    light.valueName = 'Light';
    light.onRemoteUpdate = () => {
        led.digitalWrite(light.value ? 1 : 0);
    };
};
const falshlightApi = {
    init
};
exports.default = falshlightApi;
