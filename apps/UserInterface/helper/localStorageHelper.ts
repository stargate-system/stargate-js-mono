import { AddressMapper, GateValue, ValueTypes } from "@stargate-system/core";
import {DeviceModel} from "@stargate-system/model";

let visibility: Object = {devices: {}, groups: {}};
let parameters: Object = {}

export const Categories = {
    devices: 'devices',
    groups: 'groups'
}

const initLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const storedVisibility = localStorage.getItem('visibility');
        if (storedVisibility) {
            visibility = JSON.parse(storedVisibility);
        }
        const storedParameters = localStorage.getItem('parameters');
        if (storedParameters) {
            parameters = JSON.parse(storedParameters);
        }
    }
}

const saveVisibility = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('visibility', JSON.stringify(visibility));
    }
}

const saveParameters = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('parameters', JSON.stringify(parameters));
    }
}

initLocalStorage();

const removeUnused = (devices: DeviceModel[]) => {
    // @ts-ignore
    Object.keys(visibility.devices).forEach((id) => {
        if (!devices.find((device) => device.id === id)) {
            // @ts-ignore
            delete visibility.devices[id];
        }
    });
    const groups = new Set<string>();
    devices.forEach((device) => {
        if (device.group.value !== undefined) {
            groups.add(device.group.value);
        }
    });
    // @ts-ignore
    Object.keys(visibility.groups).forEach((id) => {
        if (!groups.has(id)) {
            // @ts-ignore
            delete visibility.groups[id];
        }
    });
    saveVisibility();

    // @ts-ignore
    Object.entries(parameters).forEach((entry) => {
        const [key, content] = entry;
        const deviceId = AddressMapper.extractTargetId(key)[0];
        const device = devices.find((d) => d.id === deviceId);
        if (device) {
            const value = device.gateValues.getById(key);
            if (value && value.gateValue.type === content.type) {
                return;
            }
        }

        // @ts-ignore
        delete parameters[key];
    });
    saveParameters();
}

const setVisibility = (isVisible: boolean, category: string, id?: string) => {
    if (id !== undefined) {
        // @ts-ignore
        let categoryObject = visibility[category];
        if (categoryObject === undefined) {
            categoryObject = {};
            // @ts-ignore
            visibility[category] = categoryObject;
        }
        categoryObject[id] = isVisible;
        saveVisibility();
    }
}

const getVisibility = (category: string, id?: string) => {
    if (id !== undefined) {
        // @ts-ignore
        let categoryObject = visibility[category];
        if (categoryObject !== undefined) {
            return categoryObject[id];
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

const remove = (category: string, id: string) => {
    // @ts-ignore
    let categoryObject = visibility[category];
    if (categoryObject !== undefined && categoryObject[id] !== undefined) {
        delete categoryObject[id];
        saveVisibility();
    }
}

const setParameters = (gateValue: GateValue<any>, content: Object) => {
    // @ts-ignore
    parameters[gateValue.id] = {type: gateValue.type, content: content};
    saveParameters();
}

const getParameters = (gateValue: GateValue<any>) => {
    // @ts-ignore
    const value = parameters[gateValue.id];
    if (value) {
        return value.content ?? {};
    }
    return {};
}

export const localStorageHelper = {
    removeUnused,
    setVisibility,
    getVisibility,
    remove,
    setParameters,
    getParameters
}
