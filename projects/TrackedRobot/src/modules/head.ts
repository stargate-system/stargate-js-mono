import {GateDevice, Directions, ValueVisibility} from "@stargate-system/device";
import { Servo } from "../utils/servo";
import settings from "../utils/settings";

const init = () => {
    const {head} = settings.getSettings();

    const centerX = GateDevice.factory.createFloat(Directions.input);
    centerX.valueName = 'Head center X';
    centerX.visibility = ValueVisibility.settings;
    centerX.setRange([0, 1]);
    centerX.setValue(head.horizontalCenter);
    centerX.onRemoteUpdate = () => {
        if (centerX.value !== undefined) {
            servoX.moveTo(centerX.value);
            head.horizontalCenter = centerX.value;
            settings.save();
        }
    }
    const centerY = GateDevice.factory.createFloat(Directions.input);
    centerY.valueName = 'Head center Y';
    centerY.visibility = ValueVisibility.settings;
    centerY.setRange([0, 1]);
    centerY.setValue(head.verticalCenter);
    centerY.onRemoteUpdate = () => {
        if (centerY.value !== undefined) {
            servoY.moveTo(centerY.value);
            head.verticalCenter = centerY.value;
            settings.save();
        }
    }

    const horizontal = GateDevice.factory.createFloat(Directions.input);
    horizontal.valueName = 'Head X';
    horizontal.visibility = ValueVisibility.hidden;
    horizontal.setRange([0, 1]);
    horizontal.setValue(centerX.value);

    const vertical = GateDevice.factory.createFloat(Directions.input);
    vertical.valueName = 'Head Y';
    vertical.visibility = ValueVisibility.hidden;
    vertical.setRange([0, 1]);
    vertical.setValue(centerY.value);

    const servoX = new Servo(head.horizontalServoPin, {initialPosition: centerX.value});
    horizontal.onRemoteUpdate = () => {
        if (horizontal.value !== undefined) {
            servoX.moveTo(horizontal.value);
        }
    }

    const servoY = new Servo(head.verticalServoPin, {initialPosition: centerY.value});
    vertical.onRemoteUpdate = () => {
        if (vertical.value !== undefined) {
            servoY.moveTo(vertical.value);
        }
    }
}

const headApi = {
    init
}

export default headApi;