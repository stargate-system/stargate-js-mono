import {GateBoolean} from "../components/values/components/GateBoolean.js";
import {GateString} from "../components/values/components/GateString.js";
import {GateNumber} from "../components/values/components/GateNumber.js";
import {ValueTypes} from "../components/values/constants/ValueTypes.js";
import {ValueManifest} from "../components/values/interfaces/ValueManifest";

const fromManifest = (manifest: ValueManifest) => {
    switch (manifest.type) {
        case ValueTypes.boolean:
            return GateBoolean.fromManifest(manifest);
        case ValueTypes.string:
            return GateString.fromManifest(manifest);
        case ValueTypes.float:
        case ValueTypes.integer:
            return GateNumber.fromManifest(manifest);
        default:
            // TODO handle unknown types
            throw new Error('On creating value model: unknown type ' + manifest.type);
    }
}

const GateValueFactory = {
    fromManifest
}

export default GateValueFactory;
