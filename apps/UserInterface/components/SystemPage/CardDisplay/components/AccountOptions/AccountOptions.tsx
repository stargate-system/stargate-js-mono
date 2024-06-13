import styles from './AccountOptions.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import HeaderButton from "@/components/SystemPage/CardDisplay/components/HeaderButton/HeaderButton";
import {useEffect, useRef, useState} from "react";
import useClickOutsideDetector from "@/helper/useClickOutsideDetector";

interface AccountOptionsProps {
    className?: string
}

const AccountOptions = (props: AccountOptionsProps) => {
    const {className} = props;
    const [menuOpen, setMenuOpen] = useState(false);
    const accountOptionsRef = useRef(null);
    useClickOutsideDetector(accountOptionsRef, () => setMenuOpen(false));
    const menuOpenRef = useRef(false);

    useEffect(() => {
        menuOpenRef.current = menuOpen;
    }, [menuOpen]);

    return (
        <div ref={accountOptionsRef} className={`${className ?? ''}`}>
            <HeaderButton onClick={() => setMenuOpen(!menuOpenRef.current)}>
                <FontAwesomeIcon icon={faUser} size="xl"/>
            </HeaderButton>
            {menuOpen &&
                <div className={styles.accountOptionsContainer}>
                    <div className={`${styles.header} ${styles.highlight}`}>
                        Component in development
                    </div>
                    <div className={styles.content}>
                        Expected release: <span className={styles.highlight}>end of 2024</span>
                    </div>
                </div>
            }
        </div>
    );
}

export default AccountOptions;
