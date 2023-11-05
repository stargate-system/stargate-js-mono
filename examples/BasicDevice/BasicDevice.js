import {Directions, GateDevice, ValueFactory, logger} from 'gate-device';

const testOut = ValueFactory.createInteger(Directions.output, 'test out', [0, 10]);
GateDevice.setDeviceName('Test device');
const connection = GateDevice.startDevice();
connection.onStateChange = () => logger.logInfo('Connection state: ' + connection.state);
logger.logInfo('Waiting for connection...');

