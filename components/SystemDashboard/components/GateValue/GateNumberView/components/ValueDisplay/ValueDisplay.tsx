import {CSSProperties, Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import styles from './ValueDisplay.module.css';
import {GateNumber, ValueTypes} from "gate-core";

interface ValueDisplayProps {
    gateValue: GateNumber,
    value: number,
    setValue: Dispatch<SetStateAction<number>>,
    isActive: boolean,
    editable: boolean,
    style?: CSSProperties
}

const ValueDisplay = (props: ValueDisplayProps) => {
    const {
        gateValue,
        value,
        setValue,
        isActive,
        editable,
        style
    } = props;

    const [displayValue, setDisplayValue] = useState(value.toString());

    const valueClass = useMemo(() => {
        return `${styles.valueDisplay} ${editable ? styles.editable : styles.readonly}`
    }, [editable]);

    const onInput = (ev: any) => {
        const input = ev.target.value.trim();
        if (input.length) {
            if (input.match(/^-$/) ||
                (gateValue.type === ValueTypes.float && input.match(/^-?[0-9]+\.$/)))
            {
                setDisplayValue(input);
            } else {
                const inputValue = Number.parseFloat(input);
                if (!Number.isNaN(inputValue)) {
                    gateValue.setValue(inputValue);
                    // @ts-ignore
                    setValue(gateValue.value);
                    setDisplayValue(gateValue.toString());
                }
            }
        } else {
            setDisplayValue('');
        }
    }

    const onBlur = () => {
        setDisplayValue(value.toString());
    }

    useEffect(() => {
        setDisplayValue(value.toString())
    }, [value]);

    return (
        <input
            type='text'
            onInput={onInput}
            onBlur={onBlur}
            disabled={!editable || !isActive}
            value={displayValue}
            className={valueClass}
            style={style}
        />
    )
}

export default ValueDisplay;
