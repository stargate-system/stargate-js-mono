import {useContext, useEffect, useState} from "react";
import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";
import useModelMap from "@/components/ReactGateViewModel/hooks/useModelMap";
import styles from './DevicesDashboard.module.css';
import {DeviceModel} from "@stargate-system/model";
import DeviceGroup from "./DeviceGroup/DeviceGroup";
import {localStorageHelper} from "@/helper/localStorageHelper";
import {ConnectionState} from "@stargate-system/core";

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

        if (systemModel.state.value === ConnectionState.ready) {
            localStorageHelper.removeUnused(devices);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
