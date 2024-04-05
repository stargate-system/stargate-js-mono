import {Directions, GateDevice} from '@stargate-system/device';
import { init } from 'raspi';
import { SoftPWM } from 'raspi-soft-pwm';

init(() => {
    const led = new SoftPWM('GPIO22');

    // Setting up value to control LED brightness
    const ledBrightness = GateDevice.factory.createFloat(Directions.input);
    ledBrightness.valueName = 'Brightness';
    ledBrightness.setRange([0, 1]);
    ledBrightness.onRemoteUpdate = () => {
        led.write(ledBrightness.value);
    };

    // Switching LED off when there are no subscribers
    ledBrightness.onSubscriptionChange = (subscribed) => {
        if (subscribed) {
            led.write(ledBrightness.value);
        } else {
            led.write(0);
        }
    };

    GateDevice.setName('Raspberry LED');
    GateDevice.start();
})
