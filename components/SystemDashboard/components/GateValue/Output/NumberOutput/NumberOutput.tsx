import {GateNumber} from "gate-core";
import styles from './NumberOutput.module.css';
import {useEffect, useMemo, useState} from "react";

interface LimitedNumberInputProps {
    gateNumber: GateNumber,
    value: number,
    isActive: boolean
}

const NumberOutput = (props: LimitedNumberInputProps) => {
    const {gateNumber, value, isActive} = props;

    const [isLimited, setIsLimited] = useState(false);

    const valueClass = useMemo(() => {
        return `${styles.value} ${isLimited ? styles.limited : styles.unlimited}`
    }, [isLimited]);

    const valueBarStyle = useMemo(() => {
        if (gateNumber && isLimited && value !== undefined) {
            // @ts-ignore
            const fullRange = gateNumber.range[1] - gateNumber.range[0];
            // @ts-ignore
            const percent = (100 * (value - gateNumber.range[0])) / fullRange;
            return {
                backgroundImage: `linear-gradient(to right,
             ${isActive ? 'var(--value-bar-color-enabled)' : 'var(--value-bar-color-disabled)'} ${percent}%,
              #aaa ${percent}%)`
            };
        }
        return undefined;
    }, [gateNumber, isLimited, value]);

    const valueContainerStyle = useMemo(() => {
        if (gateNumber) {
            if (isLimited) {
                // @ts-ignore
                const length = Math.max(gateNumber.range[0].toString().length, gateNumber.range[1].toString().length);
                const width = length * 1.6;
                return {minWidth: `${Math.max(width, 2.5)}rem`};
            } else {
                return {minWidth: '4rem'};
            }
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
        <div className={styles.numberOutputContainer}>
            {isLimited && <div className={styles.valueBar} style={valueBarStyle}></div>}
            <div className={styles.valueContainer} style={valueContainerStyle}>
                {isLimited && <span className={styles.range}>{gateNumber.range[0]}</span>}
                <span className={valueClass}>{value}</span>
                {isLimited && <span className={`${styles.range} ${styles.right}`}>{gateNumber.range[1]}</span>}
            </div>
        </div>
    )
}

export default NumberOutput;
