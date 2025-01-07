"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = require("@stargate-system/device");
const servo_1 = require("../utils/servo");
const init = () => {
    const centerX = 0.5;
    const centerY = 0.53;
    const horizontal = device_1.GateDevice.factory.createFloat(device_1.Directions.input);
    horizontal.valueName = 'Camera X';
    horizontal.visibility = device_1.ValueVisibility.hidden;
    horizontal.setRange([0, 1]);
    horizontal.setValue(centerX);
    const vertical = device_1.GateDevice.factory.createFloat(device_1.Directions.input);
    vertical.valueName = 'Camera Y';
    vertical.visibility = device_1.ValueVisibility.hidden;
    vertical.setRange([0, 1]);
    vertical.setValue(centerY);
    const servoX = new servo_1.Servo(21, { initialPosition: centerX });
    horizontal.onRemoteUpdate = () => {
        var _a;
        servoX.moveTo((_a = horizontal.value) !== null && _a !== void 0 ? _a : centerX);
    };
    const servoY = new servo_1.Servo(14, { initialPosition: centerY });
    vertical.onRemoteUpdate = () => {
        var _a;
        servoY.moveTo((_a = vertical.value) !== null && _a !== void 0 ? _a : centerY);
    };
};
const headApi = {
    init
};
exports.default = headApi;
