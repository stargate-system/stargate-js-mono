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
        if (input.match(valueType === ValueTypes.float ? /^-?[0-9]*\.?[0-9]*$/ : /^-?[0-9]*$/)) {
            setDisplayValue(input);
        }
    }

    const setValueWithDisplayValue = () => {
        const inputValue = Number.parseFloat(displayValue);
        if (!Number.isNaN(inputValue)) {
            setValue(inputValue);
        }
    }

    const onBlur = () => {
        setValueWithDisplayValue();
    }

    const onKeyDown = (ev: any) => {
        switch (ev.key) {
            case 'Enter':
                setValueWithDisplayValue();
                break;
            case 'Escape':
                setDisplayValue(value.toString());
                break;
        }
    }

    useEffect(() => {
        setDisplayValue(value.toString());
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
            onKeyDown={onKeyDown}
        />
    )
}

export default NumberDisplay;
