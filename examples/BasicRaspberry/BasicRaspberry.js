import {Directions, GateDevice} from 'gate-device';
import { init } from 'raspi';
import { SoftPWM } from 'raspi-soft-pwm';

init(() => {
    const led = new SoftPWM('GPIO22');

    const ledBrightness = GateDevice.ValueFactory.createFloat(Directions.input);
    ledBrightness.valueName = 'Brightness';
    ledBrightness.setRange([0, 1]);
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

    GateDevice.setName('Raspberry LED');
    GateDevice.usePing();
    GateDevice.start();
})
