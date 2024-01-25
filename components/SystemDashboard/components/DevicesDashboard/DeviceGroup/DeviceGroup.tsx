import {DeviceModel} from "gate-viewmodel";
import Device from "../../Device/Device";
import styles from './DeviceGroup.module.css';
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faEllipsis} from "@fortawesome/free-solid-svg-icons";

interface DeviceGroupProps {
    group?: string,
    devices: DeviceModel[]
}

const DeviceGroup = (props: DeviceGroupProps) => {
    const {group, devices} = props;
    const [open, setOpen] = useState(true);

    return (
        <div className={`${styles.devicesGroup} ${group ? styles.shadow : ''}`}>
            {group &&
                <div className={`${styles.headerContainer} ${open ? styles.headerOpen : ''}`}>
                    <div className={styles.name}>{group}</div>
                    <div>
                        {open ? <FontAwesomeIcon className={styles.iconClass} icon={faChevronUp} onClick={() => setOpen(false)} />
                            : <FontAwesomeIcon className={styles.iconClass} icon={faChevronDown} onClick={() => setOpen(true)} />}
                        <FontAwesomeIcon className={styles.iconClass} icon={faEllipsis} rotation={90}/>
                    </div>
                </div>
            }
            {open &&
                <div className={styles.devicesContainer}>
                    {devices.map((deviceModel) => <Device key={deviceModel.id + Date.now()} deviceModel={deviceModel}/>)}
                </div>
            }
        </div>
    )
}

export default DeviceGroup;
