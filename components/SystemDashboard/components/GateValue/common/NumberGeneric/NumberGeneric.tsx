import {GateNumber} from "gate-core";
import styles from './NumberGeneric.module.css';
import React, {ReactNode, useMemo} from "react";

interface NumberGenericProps {
    gateNumber: GateNumber,
    value: number,
    isActive: boolean,
    valueBar: ReactNode,
    valueDisplay: ReactNode,
    isLimited: boolean
}

const NumberGeneric = (props: NumberGenericProps) => {
    const {gateNumber, valueBar, valueDisplay, isLimited} = props;

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

    return (
        <div className={styles.numberGenericContainer}>
            {isLimited && valueBar}
            <div className={styles.valueContainer} style={valueContainerStyle}>
                {isLimited && <span className={styles.range}>{gateNumber.range[0]}</span>}
                {valueDisplay}
                {isLimited && <span className={`${styles.range} ${styles.right}`}>{gateNumber.range[1]}</span>}
            </div>
        </div>
    )
}

export default NumberGeneric;
