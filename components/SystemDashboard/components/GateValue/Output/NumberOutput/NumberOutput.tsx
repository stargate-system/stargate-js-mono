import {GateNumber} from "gate-core";
import styles from './NumberOutput.module.css';
import {useCallback, useEffect, useMemo, useState} from "react";

interface LimitedNumberInputProps {
    gateNumber: GateNumber,
    value: number
}

const NumberOutput = (props: LimitedNumberInputProps) => {
    const {gateNumber, value} = props;

    const [isLimited, setIsLimited] = useState(false);

    const getProgress = useCallback(() => {
        if (gateNumber && isLimited && value !== undefined) {
            // @ts-ignore
            const fullRange = gateNumber.range[1] - gateNumber.range[0];
            // @ts-ignore
            const percent = (100 * (value - gateNumber.range[0])) / fullRange;
            return `linear-gradient(to right, green ${percent}%, #aaa ${percent}%)`
        }
        return '';
    }, [gateNumber, isLimited, value]);

    const getMinWidth = useMemo(() => {
        if (gateNumber && isLimited) {
            // @ts-ignore
            const length = Math.max(gateNumber.range[0].toString().length, gateNumber.range[1].toString().length);
            const width = length * 1.6;
            return Math.max(width, 2.5);
        }
    }, [gateNumber, isLimited]);

    useEffect(() => {
        if (gateNumber &&
            typeof gateNumber.range[0] === "number" &&
            typeof gateNumber.range[1] === "number") {
            setIsLimited(true);
        }
    }, [gateNumber]);

    return (
        <div className={styles.numberInputContainer}>
            {isLimited && <div className={styles.valueBar} style={{backgroundImage: getProgress()}}></div>}
            <div className={styles.valueContainer} style={{minWidth: `${isLimited ? getMinWidth : 4}rem`}}>
                {isLimited && <span className={styles.range}>{gateNumber.range[0]}</span>}
                <span className={`${styles.value} ${isLimited ? styles.limited : styles.unlimited}`}>{value}</span>
                {isLimited && <span className={`${styles.range} ${styles.right}`}>{gateNumber.range[1]}</span>}
            </div>
        </div>
    )
}

export default NumberOutput;
