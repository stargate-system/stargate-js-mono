import {DeviceModel} from "gate-viewmodel";
import Device from "../../Device/Device";
import styles from './DeviceGroup.module.css';

interface DeviceGroupProps {
    group?: string,
    devices: DeviceModel[]
}

const DeviceGroup = (props: DeviceGroupProps) => {
    const {group, devices} = props;

    return (
        <div className={`${styles.devicesGroup} ${group ? styles.shadow : ''}`}>
            {group &&
                <div className={styles.headerContainer}>
                    <div className={styles.name}>{group}</div>
                </div>
            }
            <div className={styles.devicesContainer}>
                {devices.map((deviceModel) => <Device key={deviceModel.id + Date.now()} deviceModel={deviceModel}/>)}
            </div>
        </div>
    )
}

export default DeviceGroup;
