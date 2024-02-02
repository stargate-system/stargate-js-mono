import {GateValueProps} from "../GateValueWrapper";
import {Directions, GateBoolean} from "gate-core";
import useModelValue from "../../../ReactGateViewModel/hooks/useModelValue";
import {CSSProperties, useEffect, useMemo, useState} from "react";
import BooleanDisplay from "../../../BooleanDisplay/BooleanDisplay";
import GateButton from "../../../GateButton/GateButton";
import {getMaxWidth} from "../../../fontHelper";

const GateBooleanView = (props: GateValueProps) => {
    const {valueModel, isActive} = props;
    // @ts-ignore
    const gateValue = valueModel.gateValue as GateBoolean;
    const value = useModelValue(valueModel.value);

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
            return {'minWidth': `calc(${getMaxWidth(labels)}px + 1.3rem)`}
        }
    }, [gateValue]);

    useEffect(() => {
        if (gateValue.direction === Directions.input) {
            setEditable(true);
        }
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
                    label={(value ? gateValue.labelTrue ?? gateValue.labelFalse : gateValue.labelFalse ?? gateValue.labelTrue) ?? ''}
                    onMouseUp={() => setValue(false)}
                    onMouseDown={() => setValue(true)}
                    disabled={!isActive}
                    style={buttonStyle}
                />
            }
        </div>
    )
}

export default GateBooleanView;
