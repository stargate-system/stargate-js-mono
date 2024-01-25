import {useContext, useEffect, useState} from "react";
import SystemModelContext from "../../../ReactGateViewModel/SystemModelContext";
import useModelMap from "../../../ReactGateViewModel/hooks/useModelMap";
import styles from './DevicesDashboard.module.css';
import {DeviceModel} from "gate-viewmodel";
import DeviceGroup from "./DeviceGroup/DeviceGroup";

const DevicesDashboard = () => {
    const systemModel = useContext(SystemModelContext);
    const devices = useModelMap(systemModel.devices);
    const [groupsMap, setGroupsMap] = useState(new Map<string, DeviceModel[]>);
    const [ungrouped, setUngrouped] = useState<DeviceModel[]>([]);

    useEffect(() => {
        const newGroupsMap = new Map<string, DeviceModel[]>();
        const newUngrouped: DeviceModel[] = [];
        devices.forEach((model) => {
            if (model.group.value !== undefined) {
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
    }, [devices]);

    return (
        <div>
            {!devices.length && <div className={styles.noDevicesContainer}>No devices available</div>}
            <DeviceGroup devices={ungrouped} />
            {Array.from(groupsMap).map(([group, devices]) => <DeviceGroup devices={devices} group={group} />)}
        </div>
    )
}

export default DevicesDashboard;
