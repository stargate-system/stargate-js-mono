import {useContext, useEffect, useState} from "react";
import SystemModelContext from "../ReactGateViewModel/SystemModelContext";
import useModelMap from "../ReactGateViewModel/hooks/useModelMap";
import styles from './DevicesDashboard.module.css';
import {DeviceModel} from "gate-viewmodel";
import DeviceGroup from "./DeviceGroup/DeviceGroup";
import {ConnectionState} from "gate-core";

const DevicesDashboard = () => {
    const systemModel = useContext(SystemModelContext);
    const devices = useModelMap(systemModel.devices);
    const [groupsMap, setGroupsMap] = useState(new Map<string, DeviceModel[]>);
    const [ungrouped, setUngrouped] = useState<DeviceModel[]>([]);

    useEffect(() => {
        const newGroupsMap = new Map<string, DeviceModel[]>();
        const newUngrouped: DeviceModel[] = [];
        devices.forEach((model) => {
            if (model.group.value !== undefined && model.group.value.length > 0) {
                let models = newGroupsMap.get(model.group.value);
                if (!models) {
                    models = [model];
                    newGroupsMap.set(model.group.value, models);
                } else {
                    models.push(model);
                }
            } else {
                newUngrouped.push(model);
            }
        });
        setUngrouped(newUngrouped);
        setGroupsMap(newGroupsMap);

        if (typeof window !== 'undefined' && systemModel.state.value === ConnectionState.ready) {
            Object.entries(localStorage)
                .filter((entry) => entry[1] === 'groupClosed')
                .forEach((entry) => {
                    if (!newGroupsMap.get(entry[0])) {
                        localStorage.removeItem(entry[0]);
                    }
                });
        }
    }, [devices]);

    return (
        <div className={styles.devicesDashboard}>
            {!devices.length && <div className={styles.noDevicesContainer}>No devices available</div>}
            <DeviceGroup devices={ungrouped} />
            {Array.from(groupsMap).map(([group, devices]) => <DeviceGroup key={group} devices={devices} group={group} />)}
        </div>
    )
}

export default DevicesDashboard;
