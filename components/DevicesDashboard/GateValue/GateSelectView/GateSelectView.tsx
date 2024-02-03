import {GateValueProps} from "../GateValueWrapper";
import {GateSelect} from "gate-core";
import useModelValue from "../../../ReactGateViewModel/hooks/useModelValue";
import Select from "react-select";
import React, {CSSProperties, useEffect, useMemo, useState} from "react";
import styles from './GateSelectView.module.css';
import {getMaxWidth} from "../../../fontHelper";

interface SelectedOption {
    value?: number,
    label: string
}

const GateSelectView = (props: GateValueProps) => {
    const {valueModel, isActive} = props;
    // @ts-ignore
    const gateValue = valueModel.gateValue as GateSelect;
    const value = useModelValue(valueModel.value);
    const [selectedOption, setSelectedOption] = useState<SelectedOption>();

    const options: SelectedOption[] = useMemo(() => {
        const options: SelectedOption[] = gateValue.values.map((option, index) => {
            return {value: index, label: option}
        })
        if (gateValue.nothingSelectedLabel !== undefined) {
            options.unshift({value: undefined, label: gateValue.nothingSelectedLabel});
        }
        return options;
    }, [valueModel]);

    const selectStyle = useMemo((): CSSProperties | undefined => {
        return {'minWidth': `calc(${getMaxWidth(gateValue.values)}px + 4rem)`}
    }, [gateValue]);

    const onSelectionChange = (option: SelectedOption) => {
        gateValue.setValue(option.value);
        setSelectedOption(option.value !== undefined ? option : undefined);
    }

    useEffect(() => {
        const option = options.find((opt) => opt.value === value);
        if (option) {
            setSelectedOption(option.value !== undefined ? option : undefined);
        }
    }, [value]);

    return (
        <div style={selectStyle}>
            <Select
                className={styles.selectInput}
                options={options}
                value={selectedOption}
                onChange={(selected) => onSelectionChange(selected as SelectedOption)}
                placeholder={gateValue.nothingSelectedLabel}
                isDisabled={!isActive}
            />
        </div>
    )
}

export default GateSelectView;
