import React, {useContext, useEffect, useState} from "react";
import StandardModal from "../StandardModal/StandardModal";
import styles from './AddToGroupModal.module.css';
import {DeviceModel} from "gate-viewmodel";
import SystemModelContext from "../../ReactGateViewModel/SystemModelContext";

interface AddToGroupModalProps {
    deviceModel: DeviceModel
}

const AddToGroupModal = (props: AddToGroupModalProps) => {
    const {deviceModel} = props;
    const systemModel = useContext(SystemModelContext);
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
};

export default AddToGroupModal;
