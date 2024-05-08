import styles from './PipeValue.module.css';
import {PipeModel} from "@stargate-system/model";
import {useEffect, useState} from "react";

export interface PipeDashboardValue {
    valueId: string
    deviceName: string,
    group?: string,
    valueName: string,
    valueType: string
}

interface PipeValueProps {
    value: PipeDashboardValue,
    selectedPipes: PipeModel[],
    setSelectedValue: (id: string, selected: boolean) => void
}

const PipeValue = (props: PipeValueProps) => {
    const {value, selectedPipes, setSelectedValue} = props;
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        setIsSelected(!!selectedPipes.find((pipe) => pipe.source === value.valueId || pipe.target === value.valueId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPipes]);

    return (
        <div
            className={`${styles.pipeValueContainer} ${isSelected ? styles.selected : styles.notSelected}`}
            onClick={() => setSelectedValue(value.valueId, !isSelected)}
        >
            <div className={styles.deviceNameContainer}>{value.deviceName}</div>
            {value.group &&
                <div className={styles.deviceNameContainer}>
                    (<span className={styles.groupContainer}>{value.group}</span>)
                </div>
            }
            <div className={styles.valueNameContainer}>{value.valueName}</div>
            <div className={styles.valueTypeContainer}>{value.valueType.toUpperCase()}</div>
        </div>
    )
}

export default PipeValue;
