import { Directions, GateDevice } from '@stargate-system/device';
import { GateString, ValueVisibility } from '@stargate-system/core';
import { Motor } from '../utils/motor';
import settings from '../utils/settings';

let leftMotor: Motor;
let rightMotor: Motor;

let chassisCommand: GateString;
let inputTimeout: NodeJS.Timeout;

const init = () => {
    const {chassis} = settings.getSettings();
    leftMotor = new Motor(chassis.leftMotorPins[0], chassis.leftMotorPins[1]);
    rightMotor = new Motor(chassis.rightMotorPins[0], chassis.rightMotorPins[1]);
    chassisCommand = GateDevice.factory.createString(Directions.input);
    chassisCommand.valueName = 'Chassis command';
    chassisCommand.visibility = ValueVisibility.hidden;
    chassisCommand.onRemoteUpdate = handleMotors;
}

const resetTimeout = () => {
    if (inputTimeout) {
        clearTimeout(inputTimeout);
    }
    inputTimeout = setTimeout(() => stop(), 500);
}

const handleMotors = (wasChanged: boolean) => {
    resetTimeout();
    if (wasChanged) {
        const command = chassisCommand.value?.split(':').map((value) => Number.parseFloat(value));
        if (command) {
            setMotors(command);
        }
    }
}

const setMotors = (command: number[]) => {
    const [forwardReverse, leftRight] = command;
    const motorCommand = [forwardReverse + leftRight, forwardReverse - leftRight];
    motorCommand[0] = normalize(motorCommand[0]);
    motorCommand[1] = normalize(motorCommand[1]);
    leftMotor.run(motorCommand[0]);
    rightMotor.run(motorCommand[1]);
}

const stop = () => {
    leftMotor.stop();
    rightMotor.stop();
}

const normalize = (input: number) => {
    if (input > 1) {
        return 1;
    }
    if (input < -1) {
        return -1;
    }
    return input;
}

const chassisApi = {
    init
}

export default chassisApi;
