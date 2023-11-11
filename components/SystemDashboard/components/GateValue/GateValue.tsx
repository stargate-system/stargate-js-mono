import {ObservableValue} from "../../model/ObservableValue";
import {useEffect, useMemo, useState} from "react";
import {Directions} from "gate-core";
import styles from './GateValue.module.css';
import GateOutput from "./Output/GateOutput";
import GateInput from "./Input/GateInput";

interface GateValueProps {
    registeredGateValue: ObservableValue<any>,
    isActive: boolean
}

const GateValue = (props: GateValueProps) => {
    const {registeredGateValue, isActive} = props;

    const [name, setName] = useState<string>();

    const gateValueClass = useMemo(() => {
        return `${styles.gateValueContainer} ${isActive ? styles.active : styles.inactive}`;
    }, [isActive]);

    const DirectionalValue = () => {
        switch (registeredGateValue.gateValue.direction) {
            case Directions.output:
                return <GateOutput registeredGateValue={registeredGateValue} isActive={isActive}/>
            case Directions.input:
                return <GateInput registeredGateValue={registeredGateValue} isActive={isActive}/>
        }
    };

    useEffect(() => {
        setName(registeredGateValue.gateValue.valueName);
    }, [registeredGateValue]);

    return (
        <div className={gateValueClass}>
            <span className={styles.nameContainer}>{name}</span>
            <div className={styles.gateValue}>
                <DirectionalValue/>
            </div>
        </div>
    );
}

export default GateValue;
