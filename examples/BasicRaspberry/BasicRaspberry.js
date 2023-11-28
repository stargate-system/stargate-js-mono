import {Directions, GateDevice} from 'gate-device';
import { init } from 'raspi';
import { SoftPWM } from 'raspi-soft-pwm';
GateDevice.config.usePing = true;

init(() => {
    const led = new SoftPWM('GPIO22');

    const ledBrightness = GateDevice.ValueFactory.createFloat(Directions.input, 'Brightness', [0, 1]);
    ledBrightness.onRemoteUpdate = () => {
        led.write(ledBrightness.value);
    };

    ledBrightness.onSubscriptionChange = (subscribed) => {
        if (subscribed) {
            led.write(ledBrightness.value);
        } else {
            led.write(0);
        }
    };

    GateDevice.setDeviceName('Raspberry LED');
    GateDevice.startDevice();
})
