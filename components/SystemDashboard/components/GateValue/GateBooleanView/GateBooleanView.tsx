import {GateValueProps} from "../GateValueWrapper";
import {Directions, GateBoolean} from "gate-core";
import useModelValue from "../../../../ReactGateViewModel/hooks/useModelValue";
import {CSSProperties, useEffect, useState} from "react";
import styles from './GateBooleanView.module.css';

const GateBooleanView = (props: GateValueProps) => {
    const {valueModel, isActive} = props;
    // @ts-ignore
    const gateValue = valueModel.gateValue as GateBoolean;
    const value = useModelValue(valueModel.value);

    const [editable, setEditable] = useState(false);
    const [label, setLabel] = useState<string | undefined>();
    const [labelStyle, setLabelStyle] = useState<CSSProperties | undefined>();

    const setValue = (value: boolean) => {
        gateValue.setValue(value);
    }

    const getLabelStyle = (): CSSProperties | undefined => {
        if (gateValue.labelTrue || gateValue.labelFalse) {
            const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('font-family');
            const fontSize = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('font-size'));
            const context = document.createElement('canvas').getContext('2d');
            // @ts-ignore
            context.font = fontSize + 'px ' + fontFamily;
            const sizes: number[] = [];
            if (gateValue.labelTrue) {
                // @ts-ignore
                const metrics = context.measureText(gateValue.labelTrue);
                sizes.push(metrics.width);
            }
            if (gateValue.labelFalse) {
                // @ts-ignore
                const metrics = context.measureText(gateValue.labelFalse);
                sizes.push(metrics.width);
            }
            return {'minWidth': Math.max(...sizes)}
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
            setLabel(gateValue.labelTrue);
        } else {
            setLabel(gateValue.labelFalse);
        }
    }, [value]);

    useEffect(() => {
        if (gateValue.direction === Directions.input) {
            setEditable(true);
        }
        setLabelStyle(getLabelStyle());
    }, [valueModel]);

    return (
        <div className={`${styles.gateBooleanContainer} ${isActive ? styles.editableActive : ''}`}>
            {editable &&
                <div className={`${styles.editableDisplay} ${editableValueDisplayClass}`} onClick={() => setValue(!value)}>
                    <div className={`${styles.editableDisplaySlider} ${valueDisplayClass}`}/>
                </div>
            }
            {!editable &&
                <div className={`${styles.readonlyDisplay} ${valueDisplayClass}`}/>
            }
            {(gateValue.labelTrue || gateValue.labelFalse) &&
                <div className={styles.labelContainer} style={labelStyle}>{label}</div>
            }
        </div>
    )
}

export default GateBooleanView;
