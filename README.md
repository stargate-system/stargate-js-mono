# Monorepo for project JS-related content

## Local setup
1. Clone
2. Open terminal under project's root directory
3. Run "npm install"
4. Run "npm build"
5. Start scanner server with "npm run dev:scanner"

## Example devices
### Test device
Containing all types of GateValues configured both as input and output,
with some logic to generate changes (can be started/stopped from UI using "Counter" switch)

**Setup:** \
Open terminal under project's root directory and run "npm run device:test".
Device should be available through Network Scanner.

### BasicRaspberry
Minimalistic example of Raspberry Pi device.
Contains one number input to control PWM on pin GPIO22

**Setup:** \
*Point 2 is temporary as libraries are not yet published to npm*

1. Copy entire BasicRaspberry folder to Raspberry,
2. Copy GateCore and GateDevice from ./libs into BasicRaspberry folder
3. Within BasicRaspberry folder, open terminal and run "npm install"
4. When finished successfully, run "sudo node BasicRaspberry.js"

Device should be available through Network Scanner

## Structure
|- **apps**: code meant to be run as standalone applications \
|- **components**: common FE components \
|- **examples**: example implementations \
|- **libs**: code shared between apps and/or meant to be published to npm