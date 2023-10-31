import Directions from "./Directions.js";
import {assignSource} from "../helper.js";
import {GateDirection} from "./GateDirection.js";

export class GateOutput extends GateDirection{
    constructor(valueType, onUpdate) {
        super(valueType);
        this.type.onUpdate = assignSource(this, onUpdate);
    }

    set value(value) {
        this.type.value = value;
    }

    toManifest() {
        const manifest = super.toManifest();
        manifest.direction = Directions.output;
        return manifest;
    }
}