import React, {ReactNode, useEffect, useMemo, useState} from "react";
import {ValueTypes} from "gate-core";
import styles from './GateValueWrapper.module.css';
import GateNumberView from "./GateNumberView/GateNumberView";
import {DeviceState, GateValueModel} from "gate-viewmodel";
import GateBooleanView from "./GateBooleanView/GateBooleanView";
import GateStringView from "./GateStringView/GateStringView";
import useModelValue from "@/components/stargate/ReactGateViewModel/hooks/useModelValue";
import GateSelectView from "./GateSelectView/GateSelectView";

interface ValueWrapperProps {
    valueModel: GateValueModel
}

export interface GateValueProps extends ValueWrapperProps{
    isActive: boolean
}

const GateValueWrapper = (props: ValueWrapperProps) => {
    const {valueModel} = props;
    const state = useModelValue(valueModel.state);
    const [isActive, setIsActive] = useState(state === DeviceState.up);

    const gateValueClass = useMemo(() => {
        return `${styles.gateValueContainer} ${isActive ? styles.active : styles.inactive}`;
    }, [isActive]);

    const valueView: ReactNode | undefined = useMemo(() => {
        switch (valueModel.gateValue.type) {
            case ValueTypes.integer:
            case ValueTypes.float:
                return <GateNumberView valueModel={valueModel} isActive={isActive}/>
            case ValueTypes.boolean:
                return <GateBooleanView valueModel={valueModel} isActive={isActive}/>
            case ValueTypes.string:
                return <GateStringView valueModel={valueModel} isActive={isActive}/>
            case ValueTypes.select:
                return <GateSelectView isActive={isActive} valueModel={valueModel}/>
        }
    }, [valueModel, isActive]);

    useEffect(() => {
        setIsActive(state === DeviceState.up);
    }, [state]);

    return (
        <div className={gateValueClass}>
            <span className={styles.nameContainer}>{valueModel.name}</span>
            <div className={styles.gateValue}>
                {valueView}
            </div>
        </div>
    );
}

export default GateValueWrapper;
