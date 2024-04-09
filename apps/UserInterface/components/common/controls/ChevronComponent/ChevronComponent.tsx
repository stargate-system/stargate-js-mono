import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styles from './ChevronComponent.module.css';

interface ChevronComponentProps {
    chevronUp: boolean,
    onClick?: () => void
}

const ChevronComponent = (props: ChevronComponentProps) => {
    const {chevronUp, onClick} = props;

    return (
        <div>
            {chevronUp ? <FontAwesomeIcon className={styles.iconClass} icon={faChevronUp} onClick={onClick} />
                : <FontAwesomeIcon className={styles.iconClass} icon={faChevronDown} onClick={onClick} />}
        </div>
    );
}

export default ChevronComponent;