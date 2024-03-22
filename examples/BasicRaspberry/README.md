# BasicRaspberry
Minimalistic example of Raspberry Pi device.
Contains one number input to control PWM on pin GPIO22.
If input is not subscribed, pin output is automatically set to 0 and
restored to current input value if subscribed again.

### Setup

1. Copy entire BasicRaspberry folder to Raspberry Pi,
2. Within BasicRaspberry folder, open terminal and run "npm install"
3. When finished successfully, run "sudo node BasicRaspberry.js"