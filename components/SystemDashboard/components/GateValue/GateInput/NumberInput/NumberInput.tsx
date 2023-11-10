import {ObservableValue} from "../../../../model/ObservableValue";
import {GateNumber} from "gate-core";
import styles from './NumberInput.module.css';
import {useCallback, useEffect, useMemo, useState} from "react";
import {handleSubscription} from "../../helper";

interface LimitedNumberInputProps {
    registeredGateNumber: ObservableValue<GateNumber>
}
const NumberInput = (props: LimitedNumberInputProps) => {
    const {registeredGateNumber} = props;

    const [subscribedValueKey, setSubscribedValueKey] = useState<string>();
    const [value, setValue] = useState<number | undefined>(registeredGateNumber.gateValue.value);
    const [isLimited, setIsLimited] = useState(false);

    useEffect(() => {
        if (registeredGateNumber &&
            typeof registeredGateNumber.gateValue.range[0] === "number" &&
            typeof registeredGateNumber.gateValue.range[1] === "number") {
            setIsLimited(true);
        }
        return handleSubscription(
            registeredGateNumber,
            subscribedValueKey,
            setSubscribedValueKey,
            () => setValue(registeredGateNumber.gateValue.value)
        );
    }, [registeredGateNumber]);

    const getProgress = useCallback(() => {
        if (registeredGateNumber && isLimited && value !== undefined) {
            // @ts-ignore
            const fullRange = registeredGateNumber.gateValue.range[1] - registeredGateNumber.gateValue.range[0];
            // @ts-ignore
            const percent = (100 * (value - registeredGateNumber.gateValue.range[0])) / fullRange;
            return `linear-gradient(to right, green ${percent}%, #aaa ${percent}%)`
        }
        return '';
    }, [registeredGateNumber, isLimited, value]);

    const getMinWidth = useMemo(() => {
        if (registeredGateNumber && isLimited) {
            // @ts-ignore
            const length = Math.max(registeredGateNumber.gateValue.range[0].toString().length, registeredGateNumber.gateValue.range[1].toString().length);
            const width = length * 1.6;
            return Math.max(width, 2.5);
        }
    }, [registeredGateNumber, isLimited]);

    return (
        <div className={styles.numberInputContainer}>
            {isLimited && <div className={styles.valueBar} style={{backgroundImage: getProgress()}}></div>}
            <div className={styles.valueContainer} style={{minWidth: `${isLimited ? getMinWidth : 4}rem`}}>
                {isLimited && <span className={styles.range}>{registeredGateNumber.gateValue.range[0]}</span>}
                <span className={`${styles.value} ${isLimited ? styles.limited : styles.unlimited}`}>{value}</span>
                {isLimited && <span className={`${styles.range} ${styles.right}`}>{registeredGateNumber.gateValue.range[1]}</span>}
            </div>
        </div>
    )
}

export default NumberInput;
