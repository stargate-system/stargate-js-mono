import {ObservableValue} from "../../model/ObservableValue";
import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import {GateValue, ValueTypes} from "gate-core";
import styles from './GateValueWrapper.module.css';
import {handleSubscription} from "../helper";
import GateNumberView from "./GateNumberView/GateNumberView";

export interface GateValueView {
    gateValue: GateValue<any>,
    value: any,
    setValue: Dispatch<SetStateAction<any>>
    isActive: boolean
}

interface GateValueProps {
    registeredGateValue: ObservableValue<any>,
    isActive: boolean
}

interface GateValueViewWrapperProps {
    value: any,
    setValue: Dispatch<SetStateAction<any>>
    isActive: boolean
}

const GateValueWrapper = (props: GateValueProps) => {
    const {registeredGateValue, isActive} = props;

    const [name, setName] = useState<string>();
    const [subscribedValueKey, setSubscribedValueKey] = useState<string>();
    const [value, setValue] = useState(registeredGateValue.gateValue.value);

    const gateValueClass = useMemo(() => {
        return `${styles.gateValueContainer} ${isActive ? styles.active : styles.inactive}`;
    }, [isActive]);

    const GateValueView: React.FC<GateValueViewWrapperProps> | undefined = useCallback((wrapperProps: GateValueViewWrapperProps) => {
        const props: GateValueView = {
            gateValue: registeredGateValue.gateValue,
            ...wrapperProps
        }
        switch (registeredGateValue.gateValue.type) {
            case ValueTypes.integer:
            case ValueTypes.float:
                return GateNumberView(props);
            case ValueTypes.boolean:
            // TODO
        }
    }, [registeredGateValue]);

    useEffect(() => {
        setName(registeredGateValue.gateValue.valueName);
        return handleSubscription(
            registeredGateValue,
            subscribedValueKey,
            setSubscribedValueKey,
            () => setValue(registeredGateValue.gateValue.value)
        );
    }, [registeredGateValue]);

    return (
        <div className={gateValueClass}>
            <span className={styles.nameContainer}>{name}</span>
            <div className={styles.gateValue}>
                <GateValueView value={value} setValue={setValue} isActive={isActive}/>
            </div>
        </div>
    );
}

export default GateValueWrapper;
