import DeviceGate from 'devicegate';
const {GateFactory, Directions, ValueTypes, logger} = DeviceGate;
const testOut = GateFactory.createValue(Directions.output, ValueTypes.number, 'test out');
const connection = GateFactory.createConnection();
connection.onStateChange = () => logger.logInfo('connection state: ' + connection.status);

