# Monorepo for project JS-related content

## Local setup
1. Clone
2. Open terminal under project's root directory
3. Run "npm install"
4. Run "npm build"

- To start local server - "npm run start:server" (available on localhost:8080)
- To start development server for User Interface - "npm run dev" (available on localhost:3000)

Check scripts in package.json for more.

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

## Repo structure
**apps**: code meant to be run as standalone applications \
**examples**: example implementations \
**libs**: code shared between apps and/or meant to be published to npm