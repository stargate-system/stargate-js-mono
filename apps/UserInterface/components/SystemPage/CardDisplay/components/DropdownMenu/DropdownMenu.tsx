import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import styles from './DropdownMenu.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

export interface MenuItem {
    id: string,
    label: string,
    icon?: IconDefinition
}

interface DropdownMenuProps {
    items: MenuItem[],
    onItemSelect: (id: string) => void,
    className?: string,
    selectedId?: string,
    header?: ReactNode
}

const DropdownMenu = (props: DropdownMenuProps) => {
    const {items, onItemSelect, className, selectedId, header} = props;

    return (
        <div className={`${styles.dropdownMenuContainer} ${className ?? ''}`}>
            {header}
            {items.map((item) => {
                return (
                    <div
                        key={item.id}
                        onClick={() => onItemSelect(item.id)}
                        className={`${styles.menuItem} ${item.id === selectedId ? styles.selected : ''}`}
                    >
                        <div className={styles.label}>
                            {item.label}
                        </div>
                        {item.icon &&
                            <FontAwesomeIcon icon={item.icon} className={styles.icon}/>
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default DropdownMenu;
