import {DeviceModel} from "gate-viewmodel";
import Device from "../../Device/Device";
import styles from './DeviceGroup.module.css';
import React, {useContext, useMemo, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import MenuComponent from "../../../../MenuComponent/MenuComponent";
import ModalContext from "local-frontend/service/ModalContext";
import StandardModal from "../../../../ModalComponent/StandardModal/StandardModal";
import SystemModelContext from "../../../../ReactGateViewModel/SystemModelContext";
import {EventName} from "gate-core";
import RenameModal from "../../../../ModalComponent/RenameModal/RenameModal";

const getFromLocalStorage = (key: string) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
}

interface DeviceGroupProps {
    group?: string,
    devices: DeviceModel[]
}

const DeviceGroup = (props: DeviceGroupProps) => {
    const {group, devices} = props;
    const [open, setOpen] = useState(!getFromLocalStorage(group ?? ''));
    const modal = useContext(ModalContext);
    const systemModel = useContext(SystemModelContext);

    const onRename = () => {
        if (modal) {
            modal.openModal(
                <RenameModal
                    currentName={group ?? ''}
                    header={`New name for ${group && group.length ? group : 'group'}`}
                    onApprove={(newName) => sendGroupEvent(newName)}
                />
            )
        }
    }

    const onDelete = () => {
        if (modal) {
            modal.openModal(
                <StandardModal
                    onApprove={() => sendGroupEvent('')}
                >
                    Sure you want to remove {group && group.length
                    ? group
                    : 'this group'}?
                </StandardModal>
            );
        }
    }

    const sendGroupEvent = (newGroupName: string) => {
        const deviceIds = systemModel.devices.values
            .filter((device) => device.group.value === group)
            .map((device) => device.id);
        systemModel.systemConnector.sendDeviceEvent(EventName.addedToGroup, [newGroupName, ...deviceIds]);
    }

    const menuItems = useMemo(() => {
        return [
            {
                label: 'Rename',
                callback: onRename
            },
            {
                label: 'Delete',
                callback: onDelete
            }
        ]
    }, []);

    const toggleGroup = () => {
        if (open) {
            localStorage.setItem(group ?? '', 'groupClosed');
        } else {
            localStorage.removeItem(group ?? '');
        }
        setOpen(!open);
    }

    return (
        <div className={`${styles.devicesGroup} ${group ? styles.groupDefined : ''}`}>
            {group &&
                <div className={`${styles.headerContainer} ${open ? styles.headerOpen : ''}`}>
                    <div className={styles.name}>{group}</div>
                    <div className={styles.iconContainer}>
                        {open ? <FontAwesomeIcon className={styles.iconClass} icon={faChevronUp} onClick={toggleGroup} />
                            : <FontAwesomeIcon className={styles.iconClass} icon={faChevronDown} onClick={toggleGroup} />}
                        <MenuComponent items={menuItems} />
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