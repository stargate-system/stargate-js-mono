# Monorepo for project JS-related content

## Local setup
1. Clone
2. Open terminal under project's root directory
3. Run "npm install"
4. Run "npm build"

To start scanner server - "npm run dev:scanner" (available on localhost:3000) \
To start local server - "npm run server" (available on localhost:8080)

## Example devices
GateDevice is configured to use Local Server connection by default.
It can be overridden to use Network scanner by adding the following to the beginning of device code:

    const {ConnectionType} = require('gate-device');
    GateDevice.config.connectionType = ConnectionType.serverless;

### Test device
Containing all types of GateValues configured both as input and output,
with some logic to generate changes (can be started/stopped from UI using "Counter" switch)

**Setup:** \
Open terminal under project's root directory and run "npm run device:test"

### Local device
Simple test device for use with Local Server

**Setup:** \
Open terminal under project's root directory and run "npm run device:local"

### BasicRaspberry
Minimalistic example of Raspberry Pi device.
Contains one number input to control PWM on pin GPIO22

**Setup:** \
*Point 2 is temporary as libraries are not yet published to npm*

1. Copy entire BasicRaspberry folder to Raspberry,
2. Copy GateCore and GateDevice from ./libs into BasicRaspberry folder
3. Within BasicRaspberry folder, open terminal and run "npm install"
4. When finished successfully, run "sudo node BasicRaspberry.js"

## Structure
|- **apps**: code meant to be run as standalone applications \
|- **components**: common FE components \
|- **examples**: example implementations \
|- **libs**: code shared between apps and/or meant to be published to npm