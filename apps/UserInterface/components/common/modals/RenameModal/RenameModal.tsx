import React, {useState} from "react";
import styles from './RenameModal.module.css';
import StandardModal from "../StandardModal/StandardModal";

interface RenameModalProps {
    currentName: string,
    header: string,
    onApprove: (newName: string) => void
}

const RenameModal = (props: RenameModalProps) => {
    const {currentName, header, onApprove} = props;
    const [newDeviceName, setNewDeviceName] = useState(currentName);

    return (
        <StandardModal
            onApprove={() => onApprove(newDeviceName)}
            approveLabel={'Save'}
            header={header}
        >
            <div className={styles.renameModalBodyContainer}>
                <input
                    type='text'
                    onInput={(ev: any) => {
                        setNewDeviceName(ev.target.value);
                    }}
                    value={newDeviceName}
                    className={styles.newNameInput}
                />
            </div>
        </StandardModal>
    )
}

export default RenameModal;
