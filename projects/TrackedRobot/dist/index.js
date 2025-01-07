"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = require("@stargate-system/device");
const eventHandler_1 = __importDefault(require("./src/utils/eventHandler"));
const camera_1 = __importDefault(require("./src/modules/camera"));
const head_1 = __importDefault(require("./src/modules/head"));
const chassis_1 = __importDefault(require("./src/modules/chassis"));
const flashlight_1 = __importDefault(require("./src/modules/flashlight"));
device_1.GateDevice.setName('Tracked Robot');
device_1.GateDevice.setInfo('SGTrackedRobot');
eventHandler_1.default.init();
camera_1.default.init();
head_1.default.init();
chassis_1.default.init();
flashlight_1.default.init();
device_1.GateDevice.start();
