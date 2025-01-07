"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@stargate-system/core");
const device_1 = require("@stargate-system/device");
let keyEvents;
let keysDown = [];
let keysTimeout;
const updateKeys = () => {
    var _a, _b;
    keysDown = (_b = (_a = keyEvents.value) === null || _a === void 0 ? void 0 : _a.substring(0, keyEvents.value.length - 1).split('º').filter((key) => key.length > 0)) !== null && _b !== void 0 ? _b : [];
    if (keysTimeout) {
        clearTimeout(keysTimeout);
    }
    keysTimeout = setTimeout(() => keysDown = [], 1000);
};
const init = () => {
    keyEvents = device_1.GateDevice.factory.createString(core_1.Directions.input);
    keyEvents.valueName = 'Key events';
    keyEvents.visibility = core_1.ValueVisibility.hidden;
    keyEvents.onRemoteUpdate = updateKeys;
};
const eventHandlerApi = {
    init,
    getKeysDown: () => keysDown
};
exports.default = eventHandlerApi;
