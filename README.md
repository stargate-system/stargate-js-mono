# Monorepo for project JS-related content

## Local setup
1. Clone
2. Open terminal under project's root directory
3. Run "npm install"
4. Run "npm build"

To start scanner server - "npm run dev:scanner" (available on localhost:3000) \
To start local server - "npm run server" (available on localhost:8080)

## Example devices
For now, GateDevice is configured to use serverless connection by default
(available through Network Scanner). It can be overridden to use Local Server
by setting

    GateDevice.config.connectionType = ConnectionType.localServer;

as shown in examples/LocalDevice/LocalDevice.js

### Test device
Containing all types of GateValues configured both as input and output,
with some logic to generate changes (can be started/stopped from UI using "Counter" switch)

**Setup:** \
Open terminal under project's root directory and run "npm run device:test".
Device should be available through Network Scanner.

### Local device
Simple test device for use with Local Server

**Setup:** \
Open terminal under project's root directory and run "npm run device:local".
Device should be available through Local Server.

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