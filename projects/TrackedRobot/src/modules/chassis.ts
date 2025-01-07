import events from '../utils/eventHandler';
// @ts-ignore
import {Gpio} from 'pigpio';

const increment = 10;
const minimum = 100;

const rightReverse = new Gpio(19, {mode: Gpio.OUTPUT});
const rightForward = new Gpio(26, {mode: Gpio.OUTPUT});
const leftReverse = new Gpio(16, {mode: Gpio.OUTPUT});
const leftForward = new Gpio(20, {mode: Gpio.OUTPUT});

const command = [0, 0];
let keyPressed = false;

const init = () => {
    setInterval(handleMotors, 20);
}

const handleMotors = () => {
    keyPressed = false;
    handleKeys();
    if (!keyPressed) {
        decrementMotors();
    }
    applyConstraints();
    setMotors();
}

const handleKeys = () => {
    if (events.getKeysDown().includes('w')) {
        command[0] = command[0] === 0 ? minimum : (command[0] + increment);
        command[1] = command[1] === 0 ? minimum : (command[1] + increment);
        keyPressed = true;
    }
    if (events.getKeysDown().includes('s')) {
        command[0] = command[0] === 0 ? -minimum : (command[0] - increment);
        command[1] = command[1] === 0 ? -minimum : (command[1] - increment);
        keyPressed = true;
    }
    if (events.getKeysDown().includes('a')) {
        command[0] = command[0] === 0 ? -minimum : (command[0] - 2 * increment);
        command[1] = command[1] === 0 ? minimum : (command[1] + 2 * increment);
        keyPressed = true;
    }
    if (events.getKeysDown().includes('d')) {
        command[0] = command[0] === 0 ? minimum : (command[0] + 2 * increment);
        command[1] = command[1] === 0 ? -minimum : (command[1] - 2 * increment);
        keyPressed = true;
    }
}

const decrementMotors = () => {
    if (command[0] !== 0) {
        command[0] = (command[0]/Math.abs(command[0])) * (Math.abs(command[0]) - increment);
    }
    if (command[1] !== 0) {
        command[1] = (command[1]/Math.abs(command[1])) * (Math.abs(command[1]) - increment);
    }
}

const applyConstraints = () => {
    if (command[0] !== 0) {
        if (Math.abs(command[0]) > 255) {
            command[0] = (command[0]/Math.abs(command[0])) * 255;
        } else if (Math.abs(command[0]) < minimum) {
            command[0] = 0;
        }
    }
    if (command[1] !== 0) {
        if (Math.abs(command[1]) > 255) {
            command[1] = (command[1]/Math.abs(command[1])) * 255;
        } else if (Math.abs(command[1]) < minimum) {
            command[1] = 0;
        }
    }
}

const setMotors = () => {
    if (command[0] >= 0) {
        leftForward.pwmWrite(command[0]);
        leftReverse.pwmWrite(0);
    } else {
        leftForward.pwmWrite(0);
        leftReverse.pwmWrite(-command[0]);
    }
    if (command[1] >= 0) {
        rightForward.pwmWrite(command[1]);
        rightReverse.pwmWrite(0);
    } else {
        rightForward.pwmWrite(0);
        rightReverse.pwmWrite(-command[1]);
    }
}

const chassisApi = {
    init
}

export default chassisApi;
