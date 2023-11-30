import styles from './DeviceHeader.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsis} from '@fortawesome/free-solid-svg-icons';
import {useContext, useEffect, useRef, useState} from "react";
import {DeviceModel} from "gate-viewmodel";
import ModalContext from "../../../../ModalContext";
import StandardModal from "../../../StandardModal/StandardModal";

interface DeviceHeaderProps {
    deviceModel: DeviceModel,
    isActive: boolean
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {deviceModel, isActive} = props;
    const modal = useContext(ModalContext);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const onRename = () => {
        console.log('Rename');
    }

    const onDelete = () => {
        if (modal) {
            modal.openModal(
                <StandardModal
                    body={`Sure you want to remove ${deviceModel.name && deviceModel.name.length
                        ? deviceModel.name
                        : 'selected device'}?`}
                    onApprove={() => deviceModel.remove()}
                />
            );
        }
    }

    useEffect(() => {
        if (menuOpen && menuRef.current) {
            menuRef.current.focus();
        }
    });

    return (
        <div className={styles.deviceHeader}>
            <div className={styles.sidePanel}/>
            <div className={styles.nameContainer}>
                {deviceModel.name ?? ''}
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
