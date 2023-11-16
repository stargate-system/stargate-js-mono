import Device from "../Device/Device";
import {useContext} from "react";
import styles from './DevicesDashboard.module.css';
import SystemModelContext from "../../../ReactGateViewModel/SystemModelContext";
import useModelMap from "../../../ReactGateViewModel/hooks/useModelMap";

const DevicesDashboard = () => {
    const systemModel = useContext(SystemModelContext);
    const devices = useModelMap(systemModel.devices);

    return (
        <div className={styles.devicesDashboard}>
            {devices.map((deviceModel) => <Device key={deviceModel.id} deviceModel={deviceModel}/>)}
        </div>
    )
}

export default DevicesDashboard;
