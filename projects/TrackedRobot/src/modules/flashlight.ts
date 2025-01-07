import { Directions, GateDevice } from "@stargate-system/device";
// @ts-ignore
import {Gpio} from 'pigpio';

const init = () => {
    const led = new Gpio(4, {mode: Gpio.OUTPUT});
    led.digitalWrite(0);
    const light = GateDevice.factory.createBoolean(Directions.input);
    light.valueName = 'Light';
    light.onRemoteUpdate = () => {
        led.digitalWrite(light.value ? 1 : 0);
    }
}

const falshlightApi = {
    init
}

export default falshlightApi;
