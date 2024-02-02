import styles from './BooleanDisplay.module.css';
import {CSSProperties, useEffect, useState} from "react";
import {getMaxWidth} from "../fontHelper";

interface BooleanDisplayProps {
    value: boolean,
    setValue: (value: boolean) => void,
    isActive?: boolean,
    editable?: boolean,
    labelTrue?: string,
    labelFalse?: string
}

const BooleanDisplay = (props: BooleanDisplayProps) => {
    const {
        value,
        setValue,
        isActive = true,
        editable = true,
        labelTrue,
        labelFalse
    } = props;

    const [label, setLabel] = useState<string | undefined>();
    const [labelStyle, setLabelStyle] = useState<CSSProperties | undefined>();

    const getLabelStyle = (): CSSProperties | undefined => {
        if (labelTrue || labelFalse) {
            const labels = [];
            if (labelTrue) {
                labels.push(labelTrue);
            }
            if (labelFalse) {
                labels.push(labelFalse)
            }
            return {'minWidth': getMaxWidth(labels) + 'px'}
        }
    }

    const valueDisplayClass = `
     ${isActive ?
        value ?
            styles.valueTrue
            : styles.valueFalse
        : styles.valueInactive}`;

    const editableValueDisplayClass = `${styles.editableDisplay} ${value ? styles.editableValueTrue : styles.editableValueFalse}`

    useEffect(() => {
        if (value) {
            setLabel(labelTrue);
        } else {
            setLabel(labelFalse);
        }
    }, [value]);

    useEffect(() => {
        setLabelStyle(getLabelStyle());
    }, [labelTrue, labelFalse]);

    return (
        <div className={`${styles.booleanDisplayContainer} ${isActive ? styles.editableActive : ''}`}>
            {editable &&
                <div className={`${editableValueDisplayClass}`} onClick={() => setValue(!value)}>
                    <div className={`${styles.editableDisplaySlider} ${valueDisplayClass}`}/>
                </div>
            }
            {!editable &&
                <div className={`${styles.readonlyDisplay} ${valueDisplayClass}`}/>
            }
            {(labelTrue || labelFalse) &&
                <div className={styles.labelContainer} style={labelStyle}>{label}</div>
            }
        </div>
    )
}

export default BooleanDisplay;
