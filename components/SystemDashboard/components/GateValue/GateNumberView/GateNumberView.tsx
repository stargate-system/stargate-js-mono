import {Directions, GateNumber} from "gate-core";
import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import styles from './GateNumberView.module.css'
import {GateValueView} from "../GateValueWrapper";
import ValueBar from "./components/ValueBar/ValueBar";

interface GateNumberViewProps extends GateValueView{
    gateValue: GateNumber,
    value: number,
    setValue: Dispatch<SetStateAction<number>>
    isActive: boolean
}

const GateNumberView = (props: GateValueView) => {
    const {gateValue, value, setValue, isActive} = props as GateNumberViewProps;

    const [isLimited, setIsLimited] = useState(false);

    const valueClass = useMemo(() => {
        return `${styles.value} ${isLimited ? styles.limited : styles.unlimited}`
    }, [isLimited]);

    const valueContainerStyle = useMemo(() => {
        if (gateValue) {
            if (isLimited) {
                // @ts-ignore
                const length = Math.max(gateValue.range[0].toString().length, gateValue.range[1].toString().length);
                const width = length * 1.6;
                return {minWidth: `${Math.max(width, 2.5)}rem`};
            } else {
                return {minWidth: '4rem'};
            }
        }
    }, [gateValue, isLimited]);

    useEffect(() => {
        if (gateValue &&
            typeof gateValue.range[0] === "number" &&
            typeof gateValue.range[1] === "number") {
            setIsLimited(true);
        }
    }, [gateValue]);

    return (
        <div className={styles.numberOutputContainer}>
            {isLimited &&
                <ValueBar
                    gateNumber={gateValue}
                    min={gateValue.range[0] ?? 0}
                    max={gateValue.range[1] ?? 1}
                    value={value}
                    setValue={setValue}
                    isActive={isActive}
                    editable={gateValue.direction === Directions.input}
                />
            }
            <div className={styles.valueContainer} style={valueContainerStyle}>
                {isLimited && <span className={styles.range}>{gateValue.range[0]}</span>}
                <span className={valueClass}>{value}</span>
                {isLimited && <span className={`${styles.range} ${styles.right}`}>{gateValue.range[1]}</span>}
            </div>
        </div>
    )
}

export default GateNumberView;
