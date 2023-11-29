import styles from './DeviceHeader.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsis} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useRef, useState} from "react";

interface DeviceHeaderProps {
    name: string
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {name} = props;

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const onRename = () => {
        console.log('Rename');
    }

    const onDelete = () => {
        console.log('Delete');
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
                {name}
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
                    <div className={styles.dropdownMenu}>
                        <span onClick={onRename} className={`${styles.menuItem} ${styles.separator}`}>Rename...</span>
                        <span onClick={onDelete} className={styles.menuItem}>Delete</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeviceHeader;
