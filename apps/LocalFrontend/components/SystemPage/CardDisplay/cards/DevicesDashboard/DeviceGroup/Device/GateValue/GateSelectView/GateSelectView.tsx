import {GateValueProps} from "../GateValueWrapper";
import {Directions, GateSelect} from "gate-core";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import Select from "react-select";
import React, {CSSProperties, useEffect, useMemo, useState} from "react";
import styles from './GateSelectView.module.css';
import {getMaxWidth} from "@/helper/fontHelper";

interface SelectedOption {
    value?: number,
    label: string
}

const GateSelectView = (props: GateValueProps) => {
    const {valueModel, isActive} = props;
    // @ts-ignore
    const gateValue = valueModel.gateValue as GateSelect;
    const value = useModelValue(valueModel.modelValue);
    const [selectedOption, setSelectedOption] = useState<SelectedOption>();

    const options: SelectedOption[] = useMemo(() => {
        const options: SelectedOption[] = gateValue.values.map((option, index) => {
            return {value: index, label: option}
        })
        if (gateValue.nothingSelectedLabel !== undefined) {
            options.unshift({value: undefined, label: gateValue.nothingSelectedLabel});
        }
        return options;
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div style={selectStyle}>
            <Select
                className={styles.selectInput}
                classNames={{
                        control: (state) => `${state.isDisabled ? styles.selectControlDisabled : styles.selectControl}`,
                        singleValue: () => `${styles.selectValue}`,
                        indicatorSeparator: (state) => `${state.isDisabled ? styles.selectIndicatorDisabled : styles.selectIndicator}`
                    }}
                options={options}
                value={selectedOption}
                onChange={(selected) => onSelectionChange(selected as SelectedOption)}
                placeholder={gateValue.nothingSelectedLabel}
                isDisabled={!isActive || gateValue.direction === Directions.output}
            />
        </div>
    )
}

export default GateSelectView;
