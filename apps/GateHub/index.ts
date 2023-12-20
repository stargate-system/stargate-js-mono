import portService from "./src/SerialPortService";
import discoveryService from "./src/DiscoveryService";
import runnerService from "./src/RunnerService";

discoveryService.initialize();
portService.initialize();
runnerService.initialize();