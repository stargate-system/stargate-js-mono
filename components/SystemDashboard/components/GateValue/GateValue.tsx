import {ObservableValue} from "../../model/ObservableValue";
import {useCallback, useEffect, useState} from "react";
import {Directions} from "gate-core";
import styles from './GateValue.module.css';
import GateOutput from "./Output/GateOutput";

interface GateValueProps {
    registeredGateValue: ObservableValue<any>,
    isActive: boolean
}

const GateValue = (props: GateValueProps) => {
    const {registeredGateValue, isActive} = props;

    const [name, setName] = useState<string>();

    const DirectionalValue = useCallback(() => {
        switch (registeredGateValue.gateValue.direction) {
            case Directions.output:
                return <GateOutput registeredGateValue={registeredGateValue} isActive={isActive}/>
            case Directions.input:
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
                <DirectionalValue/>
            </div>
        </div>
    );
}

export default GateValue;
