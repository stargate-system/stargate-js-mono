import {GateBoolean, GateNumber, GateString, ValueManifest, ValueTypes} from "gate-core";
import registries from "../model/registries";
import {ObservableValue} from "../model/ObservableValue";

const registerValue = (valueManifest: ValueManifest) => {
    switch (valueManifest.type) {
        case ValueTypes.boolean:
            const gateBoolean = GateBoolean.fromManifest(valueManifest);
            registries.gateValuesRegistry.add(new ObservableValue<GateBoolean>(gateBoolean), gateBoolean.id);
            break;
        case ValueTypes.string:
            const gateString = GateString.fromManifest(valueManifest);
            registries.gateValuesRegistry.add(new ObservableValue<GateString>(gateString), gateString.id);
            break;
        case ValueTypes.float:
        case ValueTypes.integer:
            const gateNumber = GateNumber.fromManifest(valueManifest);
            registries.gateValuesRegistry.add(new ObservableValue<GateNumber>(gateNumber), gateNumber.id);
            break;
        default:
        // TODO handle unknown types
    }
}

const GateValueService = {
    registerValue
}

export default GateValueService;
