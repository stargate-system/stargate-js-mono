import React, {ReactNode, useMemo} from "react";
import {ValueTypes} from "gate-core";
import styles from './GateValueWrapper.module.css';
import GateNumberView from "./GateNumberView/GateNumberView";
import {GateValueModel} from "gate-viewmodel";
import GateBooleanView from "./GateBooleanView/GateBooleanView";
import GateStringView from "./GateStringView/GateStringView";

export interface GateValueProps {
    valueModel: GateValueModel,
    isActive: boolean
}

const GateValueWrapper = (props: GateValueProps) => {
    const {valueModel, isActive} = props;

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
            // TODO handle custom views
        }
    }, [valueModel, isActive]);

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
