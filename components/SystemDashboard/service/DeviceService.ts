import {GateBoolean, GateNumber, GateString, Manifest, ValueTypes} from "gate-core";
import registries from "../model/registries";
import {RegisteredValue} from "../model/RegisteredValue";

const handleDeviceConnected = (manifest: Manifest) => {
    const values = manifest.values;
    if (values) {
        values.forEach((valueManifest) => {
            switch (valueManifest.type) {
                case ValueTypes.boolean:
                    const gateBoolean = GateBoolean.fromManifest(valueManifest);
                    registries.gateValuesRegistry.add(new RegisteredValue<GateBoolean>(gateBoolean), gateBoolean.id);
                    break;
                case ValueTypes.string:
                    const gateString = GateString.fromManifest(valueManifest);
                    registries.gateValuesRegistry.add(new RegisteredValue<GateString>(gateString), gateString.id);
                    break;
                case ValueTypes.float:
                case ValueTypes.integer:
                    const gateNumber = GateNumber.fromManifest(valueManifest);
                    registries.gateValuesRegistry.add(new RegisteredValue<GateNumber>(gateNumber), gateNumber.id);
                    break;
                default:
                    // TODO handle unknown types
            }
        });
    }
}

const DeviceService = {
    handleDeviceConnected
}

export default DeviceService;
