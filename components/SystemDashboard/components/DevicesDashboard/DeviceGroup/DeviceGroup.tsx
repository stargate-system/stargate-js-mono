import {DeviceModel} from "gate-viewmodel";
import Device from "../../Device/Device";
import styles from './DeviceGroup.module.css';
import React, {MutableRefObject, useContext, useMemo, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import MenuComponent from "../../../../MenuComponent/MenuComponent";
import ModalContext from "local-frontend/service/ModalContext";
import StandardModal from "../../../../ModalComponent/StandardModal/StandardModal";
import SystemModelContext from "../../../../ReactGateViewModel/SystemModelContext";
import {EventName} from "gate-core";

interface DeviceGroupProps {
    group?: string,
    devices: DeviceModel[]
}

const DeviceGroup = (props: DeviceGroupProps) => {
    const {group, devices} = props;
    const [open, setOpen] = useState(true);
    const modal = useContext(ModalContext);
    const systemModel = useContext(SystemModelContext);
    const newNameRef = useRef('');

    const RenameModalBody: React.FC<{nameRef: MutableRefObject<string>}> = (props) => {
        const {nameRef} = props;
        const [newGroupName, setNewGroupName] = useState(nameRef.current);

        return (
            <div className={styles.modalBodyContainer}>
                {`New name for ${group && group.length ? group : 'group'}`}
                <input
                    type='text'
                    onInput={(ev: any) => {
                        nameRef.current = ev.target.value;
                        setNewGroupName(ev.target.value);
                    }}
                    value={newGroupName}
                    className={styles.newNameInput}
                />
            </div>
        )
    }

    const onRename = () => {
        if (modal) {
            newNameRef.current = group ?? '';
            modal.openModal(
                <StandardModal
                    onApprove={() => sendGroupEvent(newNameRef.current)}
                    approveLabel={'Save'}
                >
                    <RenameModalBody nameRef={newNameRef}/>
                </StandardModal>
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

    return (
        <div className={`${styles.devicesGroup} ${group ? styles.shadow : ''}`}>
            {group &&
                <div className={`${styles.headerContainer} ${open ? styles.headerOpen : ''}`}>
                    <div className={styles.name}>{group}</div>
                    <div className={styles.iconContainer}>
                        {open ? <FontAwesomeIcon className={styles.iconClass} icon={faChevronUp} onClick={() => setOpen(false)} />
                            : <FontAwesomeIcon className={styles.iconClass} icon={faChevronDown} onClick={() => setOpen(true)} />}
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
