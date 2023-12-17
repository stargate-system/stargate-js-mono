import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

const openPorts: Map<string, SerialPort> = new Map<string, SerialPort>();
let temp = 0;

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
                const connection = new SerialPort({ path: port.path, baudRate: 115200 });
                openPorts.set(port.path, connection);
                const parser = connection.pipe(new ReadlineParser({ delimiter: '\r\n' }));
                parser.on('data', console.log);
                connection.on('error', (err) => {
                    console.log('Error: ', err.message)
                });
                connection.on('open', () => {
                    console.log("Port opened " + port.path);
                    const interval = setInterval(() => {
                        if (connection.isOpen) {
                            connection.write("*?manifest" + temp + '\n');
                            temp++;
                        } else {
                            clearInterval(interval);
                        }
                    }, 2000);
                });
                connection.on('close', () => {
                    parser.destroy();
                    console.log("Port closed " + port.path);
                });
            }
        }
    })
});

setInterval(checkPorts, 5000);