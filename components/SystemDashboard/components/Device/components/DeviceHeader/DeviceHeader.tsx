import styles from './DeviceHeader.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsis} from '@fortawesome/free-solid-svg-icons';
import React, {
    MutableRefObject,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import {DeviceModel} from "gate-viewmodel";
import ModalContext from "local-frontend/service/ModalContext";
import StandardModal from "../../../../../ModalComponent/StandardModal/StandardModal";
import useModelValue from "../../../../../ReactGateViewModel/hooks/useModelValue";

interface DeviceHeaderProps {
    deviceModel: DeviceModel,
    isActive: boolean
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {deviceModel, isActive} = props;
    const modal = useContext(ModalContext);
    const deviceName = useModelValue(deviceModel.name);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
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

    useEffect(() => {
        if (menuOpen && menuRef.current) {
            menuRef.current.focus();
        }
    }, [menuOpen]);

    return (
        <div className={styles.deviceHeader}>
            <div className={styles.sidePanel}/>
            <div className={styles.nameContainer}>
                {deviceName}
            </div>
            <div
                tabIndex={0}
                ref={menuRef}
                onBlur={() => setMenuOpen(false)}
                onClick={() => setMenuOpen(!menuOpen)}
                className={styles.sidePanel}
            >
                <FontAwesomeIcon className={styles.iconClass} icon={faEllipsis} rotation={90}/>
                <div hidden={!menuOpen} className={styles.dropdownMenuContainer}>
                    <div className={styles.dropdownMenu} style={{height: isActive ? '1.5rem' : '3rem'}}>
                        {!isActive && <span onClick={onDelete} className={`${styles.menuItem} ${styles.separator}`}>Delete</span>}
                        <span onClick={onRename} className={styles.menuItem}>Rename...</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeviceHeader;
