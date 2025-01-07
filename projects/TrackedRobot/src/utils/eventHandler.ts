import { Directions, GateString, ValueVisibility } from "@stargate-system/core";
import { GateDevice } from "@stargate-system/device";

let keyEvents: GateString;
let keysDown: string[] = [];
let keysTimeout: NodeJS.Timeout | undefined;

const updateKeys = () => {
    keysDown = keyEvents.value?.substring(0, keyEvents.value.length - 1).split('º').filter((key) => key.length > 0) ?? [];
    if (keysTimeout) {
        clearTimeout(keysTimeout);
    }
    keysTimeout = setTimeout(() => keysDown = [], 1000);
}

const init = () => {
    keyEvents = GateDevice.factory.createString(Directions.input);
    keyEvents.valueName = 'Key events';
    keyEvents.visibility = ValueVisibility.hidden;
    keyEvents.onRemoteUpdate = updateKeys;
}

const eventHandlerApi = {
    init,
    getKeysDown: () => keysDown
}

export default eventHandlerApi;
