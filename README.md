# Monorepo for project JS-related content

## Local setup
1. Clone
2. Open terminal under project's root directory
3. Run "npm install"
4. Run "npm build"

To start local server - "npm run server" (available on localhost:8080)

## Example devices
Device can optionally display it's current ping. To turn on this feature,
add following line in code (before invoking GateDevice.start()):

    GateDevice.config.usePing = true;

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

## GateHub
App to facilitate running multiple devices on one physical device.

**Capabilities:**
1. Detecting and connecting boards using SerialGateDevice library to Local Server
2. Serves as discovery service for all device processes running on the same physical device (multiple devices don't need to wait for discovery port to be released)
3. **(Not yet implemented)** Runs all devices from autostart list on startup

**Setup:** \
Open terminal under project's root directory and run "npm run hub"

## Repo structure
|- **apps**: code meant to be run as standalone applications \
|- **components**: common FE components \
|- **examples**: example implementations \
|- **libs**: code shared between apps and/or meant to be published to npm