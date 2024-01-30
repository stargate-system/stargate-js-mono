import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsis} from "@fortawesome/free-solid-svg-icons";
import styles from './MenuComponent.module.css';

interface MenuComponentProps {
    items: Array<{label: string, callback: () => void}>
}

const MenuComponent = (props: MenuComponentProps) => {
    const {items} = props;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (menuOpen && menuRef.current) {
            menuRef.current.focus();
        }
    }, [menuOpen]);

    return (
        <div
            className={styles.menuButton}
            ref={menuRef}
            onBlur={() => setMenuOpen(false)}
            onClick={() => setMenuOpen(!menuOpen)}
            tabIndex={0}
        >
            <FontAwesomeIcon className={styles.iconClass} icon={faEllipsis} rotation={90}/>
            <div hidden={!menuOpen} className={styles.dropdownMenuContainer}>
                <div className={styles.dropdownMenu} style={{height: `${items.length * 1.6}rem`}}>
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
