import {GateBoolean} from "./GateBoolean.js";
import {GateString} from "./GateString.js";
import {GateNumber} from "./GateNumber.js";
import {ValueTypes} from "../constants/ValueTypes.js";
import {ValueManifest} from "../interfaces/ValueManifest";
import {GateValue} from "./GateValue";
import {GateSelect} from "./GateSelect";

const fromManifest = (manifest: ValueManifest): GateValue<any> => {
    switch (manifest.type) {
        case ValueTypes.boolean:
            return GateBoolean.fromManifest(manifest);
        case ValueTypes.string:
            return GateString.fromManifest(manifest);
        case ValueTypes.float:
        case ValueTypes.integer:
            return GateNumber.fromManifest(manifest);
        case ValueTypes.select:
            return GateSelect.fromManifest(manifest);
        default:
            // TODO handle unknown types
            throw new Error('On creating value model: unknown type ' + manifest.type);
    }
}

const GateValueFactory = {
    fromManifest
}

export default GateValueFactory;
