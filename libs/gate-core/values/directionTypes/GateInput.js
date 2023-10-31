import { assignSource } from "../helper.js";
import Directions from "./Directions.js";
import {GateDirection} from "./GateDirection.js";

export class GateInput extends GateDirection{
    constructor(valueType) {
        super(valueType);
    }

    get updated() {
        return this.type.updated;
    }

    set onUpdate(onUpdate) {
        this.type.onUpdate = assignSource(this, onUpdate);
    }

    toManifest() {
        const manifest = super.toManifest();
        manifest.direction = Directions.input;
        return manifest;
    }
}