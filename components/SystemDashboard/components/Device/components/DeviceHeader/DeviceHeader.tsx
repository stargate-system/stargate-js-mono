import styles from './DeviceHeader.module.css';
import React, {
    useContext, useEffect,
    useMemo,
    useState
} from "react";
import {DeviceModel} from "gate-viewmodel";
import ModalContext from "local-frontend/service/ModalContext";
import StandardModal from "../../../../../ModalComponent/StandardModal/StandardModal";
import useModelValue from "../../../../../ReactGateViewModel/hooks/useModelValue";
import MenuComponent from "../../../../../MenuComponent/MenuComponent";
import RenameModal from "../../../../../ModalComponent/RenameModal/RenameModal";
import SystemModelContext from "../../../../../ReactGateViewModel/SystemModelContext";

interface DeviceHeaderProps {
    deviceModel: DeviceModel,
    isActive: boolean
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {deviceModel, isActive} = props;
    const modal = useContext(ModalContext);
    const systemModel = useContext(SystemModelContext);
    const deviceName = useModelValue(deviceModel.name);

    const GroupModal: React.FC = () => {
        const [groupName, setGroupName] = useState(deviceModel.group.value ?? '');
        const [existingGroups, setExistingGroups] = useState(new Set<string>());

        useEffect(() => {
            const groups = new Set<string>();
            groups.add('');
            systemModel.devices.values.forEach((device) => groups.add(device.group.value ?? ''));
            setExistingGroups(groups);
        }, []);

        return (
            <StandardModal
                onApprove={() => deviceModel.addToGroup(groupName)}
                approveLabel={'Save'}
            >
                <div className={styles.groupModalBodyContainer}>
                    <div className={styles.blockContainer}>
                        Existing groups
                        <div className={styles.existingGroupsContainer}>
                            {Array.from(existingGroups).sort().map((name) => {
                                return (
                                    <div key={name} className={styles.existingGroupInputContainer}>
                                        {name.length > 0 ? name : '-- none --'}
                                        <input
                                            type="radio"
                                            name="existingGroup"
                                            value={name}
                                            checked={groupName === name}
                                            onChange={(event) => setGroupName(event.target.value)}
                                            className={styles.groupInput}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.blockContainer}>
                        Group name
                        <input
                            type='text'
                            onInput={(ev: any) => {
                                setGroupName(ev.target.value);
                            }}
                            value={groupName}
                            className={styles.newNameInput}
                        />
                    </div>
                </div>
            </StandardModal>
        )
    }

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
                <GroupModal/>
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
            }
        ]
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
            <div className={styles.sidePanel}/>
            <div className={styles.nameContainer}>
                {deviceName}
            </div>
            <MenuComponent items={menuItems}/>
        </div>
    )
}

export default DeviceHeader;
