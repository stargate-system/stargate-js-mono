"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventHandler_1 = __importDefault(require("../utils/eventHandler"));
// @ts-ignore
const pigpio_1 = require("pigpio");
const increment = 10;
const minimum = 100;
const rightReverse = new pigpio_1.Gpio(19, { mode: pigpio_1.Gpio.OUTPUT });
const rightForward = new pigpio_1.Gpio(26, { mode: pigpio_1.Gpio.OUTPUT });
const leftReverse = new pigpio_1.Gpio(16, { mode: pigpio_1.Gpio.OUTPUT });
const leftForward = new pigpio_1.Gpio(20, { mode: pigpio_1.Gpio.OUTPUT });
const command = [0, 0];
let keyPressed = false;
const init = () => {
    setInterval(handleMotors, 20);
};
const handleMotors = () => {
    keyPressed = false;
    handleKeys();
    if (!keyPressed) {
        decrementMotors();
    }
    applyConstraints();
    setMotors();
};
const handleKeys = () => {
    if (eventHandler_1.default.getKeysDown().includes('w')) {
        command[0] = command[0] === 0 ? minimum : (command[0] + increment);
        command[1] = command[1] === 0 ? minimum : (command[1] + increment);
        keyPressed = true;
    }
    if (eventHandler_1.default.getKeysDown().includes('s')) {
        command[0] = command[0] === 0 ? -minimum : (command[0] - increment);
        command[1] = command[1] === 0 ? -minimum : (command[1] - increment);
        keyPressed = true;
    }
    if (eventHandler_1.default.getKeysDown().includes('a')) {
        command[0] = command[0] === 0 ? -minimum : (command[0] - 2 * increment);
        command[1] = command[1] === 0 ? minimum : (command[1] + 2 * increment);
        keyPressed = true;
    }
    if (eventHandler_1.default.getKeysDown().includes('d')) {
        command[0] = command[0] === 0 ? minimum : (command[0] + 2 * increment);
        command[1] = command[1] === 0 ? -minimum : (command[1] - 2 * increment);
        keyPressed = true;
    }
};
const decrementMotors = () => {
    if (command[0] !== 0) {
        command[0] = (command[0] / Math.abs(command[0])) * (Math.abs(command[0]) - increment);
    }
    if (command[1] !== 0) {
        command[1] = (command[1] / Math.abs(command[1])) * (Math.abs(command[1]) - increment);
    }
};
const applyConstraints = () => {
    if (command[0] !== 0) {
        if (Math.abs(command[0]) > 255) {
            command[0] = (command[0] / Math.abs(command[0])) * 255;
        }
        else if (Math.abs(command[0]) < minimum) {
            command[0] = 0;
        }
    }
    if (command[1] !== 0) {
        if (Math.abs(command[1]) > 255) {
            command[1] = (command[1] / Math.abs(command[1])) * 255;
        }
        else if (Math.abs(command[1]) < minimum) {
            command[1] = 0;
        }
    }
};
const setMotors = () => {
    if (command[0] >= 0) {
        leftForward.pwmWrite(command[0]);
        leftReverse.pwmWrite(0);
    }
    else {
        leftForward.pwmWrite(0);
        leftReverse.pwmWrite(-command[0]);
    }
    if (command[1] >= 0) {
        rightForward.pwmWrite(command[1]);
        rightReverse.pwmWrite(0);
    }
    else {
        rightForward.pwmWrite(0);
        rightReverse.pwmWrite(-command[1]);
    }
};
const chassisApi = {
    init
};
exports.default = chassisApi;
