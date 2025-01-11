import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './InfoItem.module.css';
import { PropsWithChildren } from "react";

interface InfoItemProps extends PropsWithChildren{
    icon: IconDefinition,
    warningLevel: number
}

const InfoItem = (props: InfoItemProps) => {
    const {icon, warningLevel, children} = props;

    const getWarningClass = () => {
        switch(warningLevel) {
            case 0:
                return styles.normal;
            case 1:
                return styles.lowWarning;
            case 2:
                return styles.highWarning;
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.icon}>
                <FontAwesomeIcon icon={icon} className={getWarningClass()}/>
            </div>
            <div>{children}</div>
        </div>
    )
}

export default InfoItem;
