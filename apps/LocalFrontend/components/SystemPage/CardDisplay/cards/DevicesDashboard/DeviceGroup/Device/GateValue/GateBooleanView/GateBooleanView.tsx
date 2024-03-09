import {GateValueProps} from "../GateValueWrapper";
import {Directions, GateBoolean} from "gate-core";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import {CSSProperties, useEffect, useMemo, useState} from "react";
import BooleanDisplay from "@/components/common/controls/BooleanDisplay/BooleanDisplay";
import GateButton from "@/components/common/controls/GateButton/GateButton";
import {getMaxWidth} from "@/helper/fontHelper";
import styles from './GateBooleanView.module.css';

const GateBooleanView = (props: GateValueProps) => {
    const {valueModel, isActive} = props;
    // @ts-ignore
    const gateValue = valueModel.gateValue as GateBoolean;
    const value = useModelValue(valueModel.modelValue);

    const [editable, setEditable] = useState(false);

    const setValue = (value: boolean) => {
        gateValue.setValue(value);
    }

    const buttonStyle = useMemo((): CSSProperties | undefined => {
        if (gateValue.labelTrue || gateValue.labelFalse) {
            const labels = [];
            if (gateValue.labelTrue) {
                labels.push(gateValue.labelTrue);
            }
            if (gateValue.labelFalse) {
                labels.push(gateValue.labelFalse)
            }
            return {'minWidth': `calc(${getMaxWidth(labels)}px + 2.3rem)`}
        }
    }, [gateValue]);

    useEffect(() => {
        if (gateValue.direction === Directions.input) {
            setEditable(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueModel]);

    return (
        <div>
            {(!editable || !gateValue.isButton) &&
                <BooleanDisplay
                    value={value}
                    setValue={setValue}
                    isActive={isActive}
                    editable={editable}
                    labelTrue={gateValue.labelTrue}
                    labelFalse={gateValue.labelFalse}
                />
            }
            {(editable && gateValue.isButton) &&
                <GateButton
                    onMouseUp={() => setValue(false)}
                    onMouseDown={() => setValue(true)}
                    disabled={!isActive}
                    style={buttonStyle}
                    className={styles.button}
                >
                    {value ? gateValue.labelTrue ?? gateValue.labelFalse : gateValue.labelFalse ?? gateValue.labelTrue}
                </GateButton>
            }
        </div>
    )
}

export default GateBooleanView;
