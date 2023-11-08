import {Registry} from "gate-core";
import {RegisteredValue} from "./RegisteredValue";

const gateValuesRegistry = new Registry<RegisteredValue<any>>();

const registries = {
    gateValuesRegistry
}

export default registries;
