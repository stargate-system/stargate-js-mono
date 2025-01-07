import {GateDevice, Directions, ValueVisibility} from "@stargate-system/device";
import { Servo } from "../utils/servo";

const init = () => {
    const centerX = 0.5;
    const centerY = 0.53;

    const horizontal = GateDevice.factory.createFloat(Directions.input);
    horizontal.valueName = 'Camera X';
    horizontal.visibility = ValueVisibility.hidden;
    horizontal.setRange([0, 1]);
    horizontal.setValue(centerX);

    const vertical = GateDevice.factory.createFloat(Directions.input);
    vertical.valueName = 'Camera Y';
    vertical.visibility = ValueVisibility.hidden;
    vertical.setRange([0, 1]);
    vertical.setValue(centerY);

    const servoX = new Servo(21, {initialPosition: centerX});
    horizontal.onRemoteUpdate = () => {
        servoX.moveTo(horizontal.value ?? centerX);
    }

    const servoY = new Servo(14, {initialPosition: centerY});
    vertical.onRemoteUpdate = () => {
        servoY.moveTo(vertical.value ?? centerY);
    }
}

const headApi = {
    init
}

export default headApi;