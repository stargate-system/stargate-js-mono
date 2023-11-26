import Device from "../Device/Device";
import {useContext} from "react";
import SystemModelContext from "../../../ReactGateViewModel/SystemModelContext";
import useModelMap from "../../../ReactGateViewModel/hooks/useModelMap";
import styles from './DevicesDashboard.module.css';

const DevicesDashboard = () => {
    const systemModel = useContext(SystemModelContext);
    const devices = useModelMap(systemModel.devices);

    return (
        <div className={styles.devicesContainer}>
            {devices.map((deviceModel) => <Device key={deviceModel.id + Date.now()} deviceModel={deviceModel}/>)}
        </div>
    )
}

export default DevicesDashboard;
