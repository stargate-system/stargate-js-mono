import Device from "../Device/Device";
import {useContext} from "react";
import {DevicesImage} from "../../systemContext";
import styles from './DevicesDashboard.module.css';

const DevicesDashboard = () => {
    const devices = useContext(DevicesImage);
    return (
        <div className={styles.devicesDashboard}>
            {devices.map((manifest) => <Device manifest={manifest}/>)}
        </div>
    )
}

export default DevicesDashboard;
