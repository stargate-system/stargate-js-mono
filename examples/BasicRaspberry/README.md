# BasicRaspberry
Minimalistic example of Raspberry Pi device.
Contains one number input to control PWM on pin GPIO22.
If input is not subscribed, pin output is automatically set to 0 and
restored to current input value if subscribed again. Uses ping.

**Setup:** \
*Point 2 is temporary as libraries are not yet published to npm*

1. Copy entire BasicRaspberry folder to Raspberry,
2. Copy GateCore and GateDevice from ./libs into BasicRaspberry folder
3. Within BasicRaspberry folder, open terminal and run "npm install"
4. When finished successfully, run "sudo node BasicRaspberry.js"