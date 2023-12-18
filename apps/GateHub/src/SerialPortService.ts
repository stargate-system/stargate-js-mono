import { SerialPort } from 'serialport'
import {LocalServerConnector} from "./LocalServerConnector";

interface SerialPortService {
    initialize: () => void
}

const openPorts: Map<string, SerialPort> = new Map<string, SerialPort>();

const checkPorts = () => SerialPort.list().then((ports) => {
    openPorts.forEach((port, path) => {
        if (!ports.find((port) => port.path === path)) {
            openPorts.delete(path);
            port.close();
        }
    });
    ports.forEach((port) => {
        if (port.pnpId !== undefined) {
            if (!openPorts.has(port.path)) {
                const serialPort = new SerialPort({ path: port.path, baudRate: 115200 });
                openPorts.set(port.path, serialPort);
                new LocalServerConnector(serialPort);
            }
        }
    })
});

const portService: SerialPortService = {
    initialize: () => setInterval(checkPorts, 5000)
}

export default portService;