import {DeviceModel} from "@stargate-system/model";

let visibility: Object = {devices: {}, groups: {}};

const initVisibility = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('visibility');
        if (stored) {
            visibility = JSON.parse(stored);
        }
    }
}

const save = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('visibility', JSON.stringify(visibility));
    }
}

initVisibility();

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
    })
    save();
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
        save();
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
        save();
    }
}

export const Categories = {
    devices: 'devices',
    groups: 'groups'
}

export const localStorageHelper = {
    removeUnused,
    setVisibility,
    getVisibility,
    remove
}
