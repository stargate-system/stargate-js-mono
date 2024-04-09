import {GateValueProps} from "../GateValueWrapper";
import {Directions, GateString} from "@stargate-system/core";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import {CSSProperties, useEffect, useState} from "react";
import styles from './GateStringView.module.css';

const GateStringView = (props: GateValueProps) => {
    const {valueModel, isActive} = props;
    const gateValue = valueModel.gateValue as GateString;
    const value = useModelValue(valueModel.modelValue);

    const [editable, setEditable] = useState(false);
    const [displayValue, setDisplayValue] = useState(value.toString());
    const [stringStyle, setStringStyle] = useState<CSSProperties>({width: '10rem'});

    const onInput = (ev: any) => {
        setDisplayValue(ev.target.value);
    }

    const onKeyDown = (ev: any) => {
        switch (ev.key) {
            case 'Enter':
                gateValue.setValue(displayValue, false);
                break;
            case 'Escape':
                setDisplayValue(value.toString());
                break;
        }
    }

    useEffect(() => {
        if (gateValue.direction === Directions.input) {
            setEditable(true);
        }
        setDisplayValue(value.toString());
        setStringStyle({width: `min(85vw, ${gateValue.minimumLength ? gateValue.minimumLength : 10}rem`});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueModel]);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    return (
        <>
            {editable &&
                <input
                    type='text'
                    onInput={onInput}
                    disabled={!editable || !isActive}
                    value={displayValue}
                    className={`${styles.valueDisplay} ${styles.editable}`}
                    onKeyDown={onKeyDown}
                    style={stringStyle}
                    onBlur={() => gateValue.setValue(displayValue)}
                />
            }
            {!editable &&
                <div
                    className={`${styles.valueDisplay} ${styles.readonly}`}
                    style={stringStyle}
                >
                    {displayValue}
                </div>
            }
        </>
    )
}

export default GateStringView;
