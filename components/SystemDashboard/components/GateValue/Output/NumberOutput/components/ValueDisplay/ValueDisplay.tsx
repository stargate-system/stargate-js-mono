import {useMemo} from "react";
import styles from './ValueDisplay.module.css';

interface ValueDisplayProps {
    value?: number,
    isLimited: boolean
}

const ValueDisplay = (props: ValueDisplayProps) => {
    const {value, isLimited} = props;

    const valueClass = useMemo(() => {
        return `${styles.value} ${isLimited ? styles.limited : styles.unlimited}`
    }, [isLimited]);

    return <span className={valueClass}>{value}</span>
}

export default ValueDisplay;
