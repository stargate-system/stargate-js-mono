import styles from './DeviceHeader.module.css';
import React, {
    MutableRefObject,
    useContext,
    useMemo,
    useRef,
    useState
} from "react";
import {DeviceModel} from "gate-viewmodel";
import ModalContext from "local-frontend/service/ModalContext";
import StandardModal from "../../../../../ModalComponent/StandardModal/StandardModal";
import useModelValue from "../../../../../ReactGateViewModel/hooks/useModelValue";
import MenuComponent from "../../../../../MenuComponent/MenuComponent";

interface DeviceHeaderProps {
    deviceModel: DeviceModel,
    isActive: boolean
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {deviceModel, isActive} = props;
    const modal = useContext(ModalContext);
    const deviceName = useModelValue(deviceModel.name);
    const newNameRef = useRef('');

    const RenameModalBody: React.FC<{nameRef: MutableRefObject<string>}> = (props) => {
        const {nameRef} = props;
        const [newDeviceName, setNewDeviceName] = useState(nameRef.current);

        return (
            <div className={styles.modalBodyContainer}>
                {`New name for ${deviceName && deviceName.length ? deviceName : 'selected device'}`}
                <input
                    type='text'
                    onInput={(ev: any) => {
                        nameRef.current = ev.target.value;
                        setNewDeviceName(ev.target.value);
                    }}
                    value={newDeviceName}
                    className={styles.newNameInput}
                />
            </div>
        )
    }

    const onRename = () => {
        if (modal) {
            newNameRef.current = deviceName ?? '';
            modal.openModal(
                <StandardModal
                    onApprove={() => deviceModel.rename(newNameRef.current)}
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
                    onApprove={() => deviceModel.remove()}
                >
                    Sure you want to remove {deviceName && deviceName.length
                    ? deviceName
                    : 'selected device'}?
                </StandardModal>
            );
        }
    }

    const menuItems = useMemo(() => {
        const items = [
            {
                label: 'Rename',
                callback: onRename
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
