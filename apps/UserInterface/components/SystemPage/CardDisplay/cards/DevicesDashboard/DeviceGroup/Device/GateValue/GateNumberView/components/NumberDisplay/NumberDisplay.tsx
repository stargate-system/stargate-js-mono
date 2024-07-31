import {CSSProperties, useEffect, useMemo, useState} from "react";
import styles from './NumberDisplay.module.css';
import {ValueTypes} from "@stargate-system/core";

interface NumberDisplayProps {
    valueType?: ValueTypes | string
    value: number,
    setValue: Function,
    isActive: boolean,
    editable: boolean,
    limited:boolean,
    style?: CSSProperties
}

const NumberDisplay = (props: NumberDisplayProps) => {
    const {
        valueType = ValueTypes.float,
        value,
        setValue,
        isActive,
        editable,
        limited,
        style
    } = props;

    const [displayValue, setDisplayValue] = useState(value.toString());

    const valueClass = useMemo(() => {
        return `${styles.valueDisplay} ${editable ? styles.editable : styles.readonly} ${limited ? styles.limited : styles.unlimited}`
    }, [editable, limited]);

    const onInput = (ev: any) => {
        const input = ev.target.value.trim();
        if (input.match(valueType === ValueTypes.float ? /^-?[0-9]*\.?[0-9]*$/ : /^-?[0-9]*$/)) {
            setDisplayValue(input);
        }
    }

    const setValueWithDisplayValue = (equalityCheck?: boolean) => {
        const inputValue = Number.parseFloat(displayValue);
        if (!Number.isNaN(inputValue)) {
            setValue(inputValue, equalityCheck);
        }
    }

    const onBlur = () => {
        setValueWithDisplayValue();
    }

    const onKeyDown = (ev: any) => {
        switch (ev.key) {
            case 'Enter':
                setValueWithDisplayValue(false);
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
        <div className={styles.valueDisplayContainer}>
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
        </div>
    )
}

export default NumberDisplay;
