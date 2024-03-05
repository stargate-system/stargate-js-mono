# Monorepo for project JS-related content

## Local setup
1. Clone
2. Open terminal under project's root directory
3. Run "npm install"
4. Run "npm build"

- To start local server - "npm run server" (available on localhost:8080)
- To start development server for frontend - "npm run dev" (available on localhost:3000)
- To create apps ready to use outside this repository - "bash CreateStandaloneApps.sh"
(will create StargateApps directory next to repository root directory)

## Examples

### BlankProjectJS, BlankProjectTS
Templates for CreateStandaloneApps script, not meant to be used

### Other examples
Other examples contains their own README files, explaining purpose and usage

## GateHub
App to facilitate running multiple devices on one physical device.

**Capabilities:**
1. Detecting and connecting boards using SerialGateDevice library to Local Server
2. Serves as discovery service for all device processes running on the same physical device (multiple devices don't need to wait for discovery port to be released)
3. Runs all processes defined in autostart list on startup

**Setup:** \
Open terminal under project's root directory and run "npm run hub"

**Autostart** \
Autostart list is defined in ./autostart.ts in format [\<working directory\>, \<command\>]

Example:

    export const autostart = [
        ["../my-devices/device1", "node device-one.js"],
        ["../my-devices/device2", "npm run device-two"]
    ];

## Repo structure
**apps**: code meant to be run as standalone applications \
**examples**: example implementations \
**libs**: code shared between apps and/or meant to be published to npm