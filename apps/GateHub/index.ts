import portService from "./src/SerialPortService";
import discoveryService from "./src/DiscoveryService";
import runnerService from "./src/RunnerService";
import remoteService, { Remote } from "./src/RemoteService";
import fs from 'fs';

let remote: Remote | undefined;

try {
    const remoteFile = fs.readFileSync('remote.json').toString();
    remote = JSON.parse(remoteFile);
} catch(err) {
    if (!(err instanceof Error && err.message.match(/no such file or directory/i))) {
        console.log('On reading remote file', err);
    }
}
if (remote && remote.id && remote.serverId && remote.password) {
    console.log("Remote access mode");
    remoteService.initialize(remote);
} else {
    console.log("Local discovery mode");
    discoveryService.initialize();
    portService.initialize();
}
runnerService.initialize();


