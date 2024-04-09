import {DeviceModel} from "@stargate-system/model";
import Device from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DeviceGroup/Device/Device";
import styles from './DeviceGroup.module.css';
import React, {useContext, useMemo, useState} from "react";
import MenuComponent from "@/components/common/controls/MenuComponent/MenuComponent";
import ModalContext from "@/components/SystemPage/ModalContext";
import StandardModal from "@/components/common/modals/StandardModal/StandardModal";
import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";
import {EventName} from "@stargate-system/core";
import RenameModal from "@/components/common/modals/RenameModal/RenameModal";
import {Categories, localStorageHelper} from "@/helper/localStorageHelper";
import ChevronComponent from "@/components/common/controls/ChevronComponent/ChevronComponent";

interface DeviceGroupProps {
    group?: string,
    devices: DeviceModel[]
}

const DeviceGroup = (props: DeviceGroupProps) => {
    const {group, devices} = props;
    const [open, setOpen] = useState(localStorageHelper.getVisibility(Categories.groups, group) ?? true);
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
        if (systemModel.systemConnector) {
            systemModel.systemConnector.sendDeviceEvent(EventName.addedToGroup, [newGroupName, ...deviceIds]);
        }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleVisibility = () => {
        localStorageHelper.setVisibility(!open, Categories.groups, group);
        setOpen(!open);
    }

    return (
        <div className={`${styles.devicesGroup} ${group ? styles.groupDefined : ''}`}>
            {group &&
                <div className={`${styles.headerContainer} ${open ? styles.headerOpen : ''}`}>
                    <div className={styles.name}>{group}</div>
                    <div className={styles.iconContainer}>
                        <ChevronComponent chevronUp={open} onClick={toggleVisibility} />
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
