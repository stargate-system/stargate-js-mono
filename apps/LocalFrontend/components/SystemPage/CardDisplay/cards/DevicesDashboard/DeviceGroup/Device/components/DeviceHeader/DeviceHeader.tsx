import styles from './DeviceHeader.module.css';
import React, {
    useContext,
    useMemo
} from "react";
import {DeviceModel} from "gate-viewmodel";
import ModalContext from "@/components/SystemPage/ModalContext";
import StandardModal from "@/components/common/modals/StandardModal/StandardModal";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import MenuComponent from "@/components/common/controls/MenuComponent/MenuComponent";
import RenameModal from "@/components/common/modals/RenameModal/RenameModal";
import AddToGroupModal from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DeviceGroup/Device/components/AddToGroupModal/AddToGroupModal";
import ModifyDeviceValuesModal from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DeviceGroup/Device/components/ModifyDeviceValuesModal/ModifyDeviceValuesModal";
import {ValueVisibility} from "gate-core";
import DeviceSettingsModal from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DeviceGroup/Device/components/DeviceSettingsModal/DeviceSettingsModal";
import ChevronComponent from "@/components/common/controls/ChevronComponent/ChevronComponent";

interface DeviceHeaderProps {
    deviceModel: DeviceModel,
    isActive: boolean,
    open?: boolean,
    toggleVisibility?: () => void
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {deviceModel, isActive, open, toggleVisibility} = props;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    return (
        <div className={styles.deviceHeader}>
            <div className={`${styles.activeLamp} ${isActive ? styles.activeLampOn : styles.activeLampOff}`}/>
            <div className={styles.nameContainer}>
                {deviceName}
            </div>
            <div className={styles.iconContainer}>
                {(open !== undefined) &&
                    <ChevronComponent chevronUp={open} onClick={toggleVisibility} />
                }
                <MenuComponent items={menuItems}/>
            </div>
        </div>
    )
}

export default DeviceHeader;
