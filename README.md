# Monorepo for project JS-related content

## Local setup
1. Clone
2. Open terminal under project's root directory
3. Run "npm install"
4. Run "npm build"

- To start local server - "npm run server" (available on localhost:8080)
- To start development server for frontend - "npm run dev" (available on localhost:3000)

### CreateStandaloneApps.js
Optionally, CreateStandaloneApps.js helper can be used.
It creates StargateApps directory next to repository root directory.
- With -i flag, it will create apps with current version of dependencies, ready to use outside monorepo.
- Without -i flag, it will copy files without dependencies (for publishing purposes).

Additionally, -b flag can be used to build project beforehand, i.e. running:

    node CreateStandaloneApps.js -b -i

will first build the project, then copy relevant packages, and finally link current version of dependencies


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
Autostart list is defined in autostart.js in format [\<working directory\>, \<command\>]

Example:

    const autostart = [
        ["../my-devices/device1", "node device-one.js"],
        ["../my-devices/device2", "npm run device-two"]
    ];

## Repo structure
**apps**: code meant to be run as standalone applications \
**examples**: example implementations \
**libs**: code shared between apps and/or meant to be published to npm