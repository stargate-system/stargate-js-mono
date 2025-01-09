import { GateString } from "@stargate-system/core";
import { Directions, GateDevice } from "@stargate-system/device";
import { spawn } from "child_process";

let cpuTemperature: GateString;
let wifiSignal: GateString;

const init = () => {
    cpuTemperature = GateDevice.factory.createString(Directions.output);
    cpuTemperature.valueName = 'CPU Temperature';
    wifiSignal = GateDevice.factory.createString(Directions.output);
    wifiSignal.valueName = 'WiFi Signal';
    setInterval(() => {
        readTemperature();
        readSignalStrength();
    }, 2000);
}

const readTemperature = () => {
	const cmd = spawn("/usr/bin/vcgencmd", ["measure_temp"]);

	cmd.stdout.on("data", (buf) => {
        const searchArray = buf?.toString("utf8").split('=');
        if (searchArray && searchArray[1]) {
		    cpuTemperature.setValue(searchArray[1].replace("'C", '').trim());
        }
	});
}

const readSignalStrength = () => {
    const cmd = spawn('iwconfig', ['wlan0']);

    cmd.stdout.on("data", (buf) => {
        const searchArray = buf?.toString('utf8').split('Link Quality=');
        if (searchArray && searchArray[1]) {
            const searchArray2 = searchArray[1].split('Signal level=');
            const searchArray3 = searchArray2[1].split('dBm');
		    wifiSignal.setValue(searchArray2[0] + searchArray3[0]);
        }
    });
}

const infoApi = {
    init
}

export default infoApi;
