import styles from './DeviceHeader.module.css';
import React, {
    useContext,
    useMemo
} from "react";
import {DeviceModel} from "gate-viewmodel";
import ModalContext from "local-frontend/service/ModalContext";
import StandardModal from "../../../../ModalComponent/StandardModal/StandardModal";
import useModelValue from "../../../../ReactGateViewModel/hooks/useModelValue";
import MenuComponent from "../../../../MenuComponent/MenuComponent";
import RenameModal from "../../../../ModalComponent/RenameModal/RenameModal";
import AddToGroupModal from "../../../../ModalComponent/AddToGroupModal/AddToGroupModal";
import ModifyDeviceValuesModal from "../../../../ModalComponent/ModifyDeviceValuesModal/ModifyDeviceValuesModal";
import {ValueVisibility} from "gate-core";
import DeviceSettingsModal from "../../../../ModalComponent/DeviceSettingsModal/DeviceSettingsModal";

interface DeviceHeaderProps {
    deviceModel: DeviceModel,
    isActive: boolean
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {deviceModel, isActive} = props;
    const modal = useContext(ModalContext);
    const deviceName = useModelValue(deviceModel.name);

    const onRename = () => {
        if (modal) {
            modal.openModal(
                <RenameModal
                    currentName={deviceName ?? ''}
                    header={`New name for ${deviceName && deviceName.length ? deviceName : 'selected device'}`}
                    onApprove={(newName) => deviceModel.rename(newName)}
                />
            )
        }
    }

    const onDelete = () => {
        if (modal) {
            modal.openModal(
                <StandardModal
                    onApprove={() => deviceModel.remove()}
                >
                    Sure you want to remove {deviceName && deviceName.length
                    ? deviceName
                    : 'selected device'}?
                </StandardModal>
            );
        }
    }

    const onGroup = () => {
        if (modal) {
            modal.openModal(
                <AddToGroupModal deviceModel={deviceModel}/>
            )
        }
    }

    const onValues = () => {
        if (modal) {
            modal.openModal(
                <ModifyDeviceValuesModal deviceModel={deviceModel}/>
            )
        }
    }

    const onSettings = () => {
        if (modal) {
            modal.openModal(
                <DeviceSettingsModal deviceId={deviceModel.id}/>
            )
        }
    }

    const menuItems = useMemo(() => {
        const items = [
            {
                label: 'Rename',
                callback: onRename
            },
            {
                label: 'Group',
                callback: onGroup
            },
            {
                label: 'Values',
                callback: onValues
            }
        ]
        if (deviceModel.gateValues.values.find((value) => value.gateValue.visibility === ValueVisibility.settings.toString())) {
            items.push({
                label: 'Settings',
                callback: onSettings
            })
        }
        if (!isActive) {
            items.push({
                label: 'Delete',
                callback: onDelete
            });
        }
        return items;
    }, [isActive]);

    return (
        <div className={styles.deviceHeader}>
            <div className={`${styles.activeLamp} ${isActive ? styles.activeLampOn : styles.activeLampOff}`}/>
            <div className={styles.nameContainer}>
                {deviceName}
            </div>
            <MenuComponent items={menuItems}/>
        </div>
    )
}

export default DeviceHeader;
