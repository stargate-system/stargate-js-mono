const {spawn} = require('child_process');
const fs = require('fs');

const APPS_DIR = '../StargateApps';

const createApps = () => {
    cleanup();
    copy();
    install();
}

const cleanup = () => {
    console.log('Removing previous version...');
    try {
        fs.rmSync(APPS_DIR, {recursive: true});
    } catch (err) {}
}

const copyLocalServer = () => {
    fs.cpSync('./apps/LocalServer/dist', APPS_DIR + '/LocalServer/dist', {recursive: true});
    fs.cpSync('./apps/LocalServer/out', APPS_DIR + '/LocalServer/out', {recursive: true});
    fs.cpSync('./libs/GateCore', APPS_DIR + '/LocalServer/libs/GateCore', {recursive: true});
    fs.copyFileSync('./apps/LocalServer/package.json', APPS_DIR + '/LocalServer/package.json');
}

const copyGateHub = () => {
    fs.cpSync('./apps/GateHub/dist', APPS_DIR + '/GateHub/dist', {recursive: true});
    fs.cpSync('./libs/GateCore', APPS_DIR + '/GateHub/libs/GateCore', {recursive: true});
    fs.cpSync('./libs/GateDiscovery', APPS_DIR + '/GateHub/libs/GateDiscovery', {recursive: true});
    fs.copyFileSync('./apps/GateHub/package.json', APPS_DIR + '/GateHub/package.json');
    fs.copyFileSync('./apps/GateHub/autostart.js', APPS_DIR + '/GateHub/autostart.js');
}

const copyBlankProjectJS = () => {
    fs.cpSync('./examples/BlankProjectJS', APPS_DIR + '/BlankProjectJS', {recursive: true});
    fs.cpSync('./libs/GateCore', APPS_DIR + '/BlankProjectJS/libs/GateCore', {recursive: true});
    fs.cpSync('./libs/GateDiscovery', APPS_DIR + '/BlankProjectJS/libs/GateDiscovery', {recursive: true});
    fs.cpSync('./libs/GateDevice', APPS_DIR + '/BlankProjectJS/libs/GateDevice', {recursive: true});
    fs.cpSync('./libs/GateController', APPS_DIR + '/BlankProjectJS/libs/GateController', {recursive: true});
    fs.cpSync('./libs/GateModel', APPS_DIR + '/BlankProjectJS/libs/GateModel', {recursive: true});
}

const copyBlankProjectTS = () => {
    fs.cpSync('./examples/BlankProjectTS', APPS_DIR + '/BlankProjectTS', {recursive: true});
    fs.cpSync('./libs/GateCore', APPS_DIR + '/BlankProjectTS/libs/GateCore', {recursive: true});
    fs.cpSync('./libs/GateDiscovery', APPS_DIR + '/BlankProjectTS/libs/GateDiscovery', {recursive: true});
    fs.cpSync('./libs/GateDevice', APPS_DIR + '/BlankProjectTS/libs/GateDevice', {recursive: true});
    fs.cpSync('./libs/GateController', APPS_DIR + '/BlankProjectTS/libs/GateController', {recursive: true});
    fs.cpSync('./libs/GateModel', APPS_DIR + '/BlankProjectTS/libs/GateModel', {recursive: true});
}

const copy = () => {
    console.log('Copying files...');
    copyLocalServer();
    copyGateHub();
    copyBlankProjectJS();
    copyBlankProjectTS();
}

const spawnProcess = (spawnFunction, nextProcess) => {
    const childProcess = spawnFunction();
    childProcess.stdout.on('data', (data) => console.log(data.toString()));
    childProcess.stderr.on('data', (data) => console.log(data.toString()));
    childProcess.on('close', (code) => {
        if (code === 0) {
            if (nextProcess) {
                nextProcess();
            }
        } else {
            console.log("Aborted due to errors");
            if (nextProcess) {
                process.exit(1);
            }
        }
    });
    childProcess.on('error', (err) => {
        console.log(err);
        console.log("Aborted due to errors");
        if (nextProcess) {
            process.exit(1);
        }
    });
}

const isWindows = process.platform === 'win32';

const install = () => {
    console.log('Installing LocalServer...');
    const spawnFunction = () => spawn(
        (isWindows ? 'npm.cmd' : 'npm'),
        ['link', './libs/GateCore'],
        {cwd: `${APPS_DIR}/LocalServer`}
    );
    spawnProcess(spawnFunction, installGateHub);
}

const installGateHub = () => {
    console.log('Installing GateHub...');
    const spawnFunction = () => spawn(
        (isWindows ? 'npm.cmd' : 'npm'),
        ['link', './libs/GateCore', './libs/GateDiscovery'],
        {cwd: `${APPS_DIR}/GateHub`}
    );
    spawnProcess(spawnFunction, installBlankProjectJS);
}

const installBlankProjectJS = () => {
    console.log('Installing BlankProjectJS...');
    const spawnFunction = () => spawn(
        (isWindows ? 'npm.cmd' : 'npm'),
        ['link', './libs/GateCore', './libs/GateDiscovery', './libs/GateDevice', './libs/GateController', './libs/GateModel'],
        {cwd: `${APPS_DIR}/BlankProjectJS`}
    );
    spawnProcess(spawnFunction, installBlankProjectTS);
}

const installBlankProjectTS = () => {
    console.log('Installing BlankProjectTS...');
    const spawnFunction = () => spawn(
        (isWindows ? 'npm.cmd' : 'npm'),
        ['link', './libs/GateCore', './libs/GateDiscovery', './libs/GateDevice', './libs/GateController', './libs/GateModel'],
        {cwd: `${APPS_DIR}/BlankProjectTS`}
    );
    spawnProcess(spawnFunction);
}

const buildFlag = !!process.argv[2] && !!process.argv[2].match(/^-b/i);
if (buildFlag) {
    console.log('Building project...');
    const spawnFunction = () => spawn((isWindows ? 'npm.cmd' : 'npm'), ['run', 'build']);
    spawnProcess(spawnFunction, createApps);
} else {
    createApps();
}
