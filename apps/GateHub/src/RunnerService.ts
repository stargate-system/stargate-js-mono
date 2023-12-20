import {autostart} from "../autostart";
import {exec} from "child_process";

const initialize = () => {
    autostart.forEach((row) => {
        const [workdir, command] = row;
        exec(command, { cwd: workdir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout:\n${stdout}`);
        });
    })
}

const runnerService = {
    initialize
}

export default runnerService;
