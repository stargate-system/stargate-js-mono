import {ObservableValue} from "../../model/ObservableValue";
import {useCallback, useEffect, useState} from "react";
import {ValueTypes} from "gate-core";
import NumberInput from "./GateInput/NumberInput/NumberInput";
import styles from './GateValue.module.css';

interface GateValueProps {
    registeredGateValue: ObservableValue<any>,
    isActive: boolean
}

const GateValue = (props: GateValueProps) => {
    const {registeredGateValue, isActive} = props;

    const [name, setName] = useState<string>();

    const TypeValue = useCallback(() => {
        switch (registeredGateValue.gateValue.type) {
            case ValueTypes.integer:
            case ValueTypes.float:
                return <NumberInput registeredGateNumber={registeredGateValue}/>;
            case ValueTypes.boolean:
            // TODO
        }
    }, [registeredGateValue]);

    useEffect(() => {
        setName(registeredGateValue.gateValue.valueName);
    }, [registeredGateValue]);

    return (
        <div className={styles.gateValueContainer}>
            <span className={styles.nameContainer}>{name}</span>
            <div className={`${styles.gateValue} ${isActive ? styles.active : styles.inactive}`}>
                <TypeValue/>
            </div>
        </div>
    );
}

export default GateValue;
