import {
    ConfigurableValueFactory,
    GateValue
} from "gate-core";
import {device} from "../api/GateDevice.js";
import logger from "./DeviceLogger.js";

const initializeValue = (value: GateValue<any>) => {
    if (device.isStarted) {
        logger.warning('Cannot initialize value (' + value.valueName + ') after device was started');
    } else {
        device.values.add(value, value.id);
        value.onLocalUpdate = (wasChanged) => {
            if (wasChanged && value.subscribed) {
                device.connection.sendGateValue(value);
            }
        };
        value.onSubscriptionChange = (subscribed) => {
            if (subscribed) {
                device.connection.sendGateValue(value);
            }
        }
    }
}

const ValueFactory = new ConfigurableValueFactory(initializeValue);

export default ValueFactory;
