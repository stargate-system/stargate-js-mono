import {CSSProperties, useEffect, useMemo, useState} from "react";
import styles from './NumberDisplay.module.css';
import {ValueTypes} from "gate-core";

interface NumberDisplayProps {
    valueType?: ValueTypes | string
    value: number,
    setValue: Function,
    isActive: boolean,
    editable: boolean,
    style?: CSSProperties
}

const NumberDisplay = (props: NumberDisplayProps) => {
    const {
        valueType = ValueTypes.float,
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
                (valueType === ValueTypes.float && input.match(/^-?[0-9]+\.$/)))
            {
                setDisplayValue(input);
            } else {
                const inputValue = Number.parseFloat(input);
                if (!Number.isNaN(inputValue)) {
                    setValue(inputValue);
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

export default NumberDisplay;
