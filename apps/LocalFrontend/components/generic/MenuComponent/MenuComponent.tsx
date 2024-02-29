import React, {useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis} from "@fortawesome/free-solid-svg-icons";
import styles from './MenuComponent.module.css';
import useClickOutsideDetector from "@/helper/useClickOutsideDetector";

interface MenuComponentProps {
    items: Array<{label: string, callback: () => void}>
}

const MenuComponent = (props: MenuComponentProps) => {
    const {items} = props;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    useClickOutsideDetector(menuRef, () => setMenuOpen(false));

    return (
        <div
            className={styles.menuButton}
            ref={menuRef}
            onClick={() => setMenuOpen(!menuOpen)}
            tabIndex={0}
        >
            <FontAwesomeIcon className={styles.iconClass} icon={faEllipsis} rotation={90}/>
            <div hidden={!menuOpen} className={styles.dropdownMenuContainer}>
                <div className={styles.dropdownMenu} style={{height: `${items.length * 2}rem`}}>
                    {items.map((item, index) => {
                        return (
                            <span
                                key={item.label}
                                onClick={item.callback}
                                className={index > 0 ? `${styles.menuItem} ${styles.separator}` : styles.menuItem}
                            >
                                {item.label}
                            </span>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default MenuComponent;
