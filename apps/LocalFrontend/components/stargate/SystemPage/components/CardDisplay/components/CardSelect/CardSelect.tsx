import HeaderButton from "@/components/stargate/SystemPage/components/CardDisplay/components/HeaderButton/HeaderButton";
import styles from './CardSelect.module.css';
import {useEffect, useRef, useState} from "react";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DropdownMenu from "@/components/stargate/SystemPage/components/CardDisplay/components/DropdownMenu/DropdownMenu";
import {cards} from "@/components/stargate/SystemPage/components/CardDisplay/CardDisplay";
import useClickOutsideDetector from "@/helper/useClickOutsideDetector";

interface CardSelectProps {
    currentCard: string,
    setCurrentCard: (id: string) => void
    className?: string
}

const CardSelect = (props: CardSelectProps) => {
    const {currentCard, setCurrentCard, className} = props;

    const [menuOpen, setMenuOpen] = useState(false);
    const cardSelectRef = useRef(null);
    useClickOutsideDetector(cardSelectRef, () => setMenuOpen(false));

    // introduced as bugfix - on mobile devices state of menuOpen not updating
    const menuOpenRef = useRef(false);

    const onCardSelect = (id: string) => {
        setCurrentCard(id);
        setMenuOpen(false);
    };

    useEffect(() => {
        menuOpenRef.current = menuOpen;
    }, [menuOpen]);

    return (
        <div ref={cardSelectRef} className={`${styles.cardSelectContainer} ${className ?? ''}`}>
            <HeaderButton onClick={() => setMenuOpen(!menuOpenRef.current)}>
                <FontAwesomeIcon icon={faBars} size="xl"/>
            </HeaderButton>
            {menuOpen &&
                <DropdownMenu
                    items={Object.values(cards)}
                    onItemSelect={onCardSelect}
                    className={styles.dropdownMenu}
                    selectedId={currentCard}
                />
            }
        </div>
    );
}

export default CardSelect;
