import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import styles from './ValueSelect.module.css';
import {DeviceModel, GateValueModel} from "gate-viewmodel";
import Select from 'react-select';

interface ValueSelectProps {
    devices: DeviceModel[],
    values: GateValueModel[],
    setSelectedDevice: Dispatch<SetStateAction<DeviceModel | undefined>>,
    setSelectedValue: Dispatch<SetStateAction<GateValueModel | undefined>>
}

interface SelectedOption {
    value?: DeviceModel | GateValueModel,
    label: string | React.JSX.Element
}

const ValueSelect = (props: ValueSelectProps) => {
    const {
        devices,
        values,
        setSelectedDevice,
        setSelectedValue
    } = props;

    const [deviceOption, setDeviceOption] = useState<SelectedOption | undefined>();
    const [valueOption, setValueOption] = useState<SelectedOption | undefined>();

    const getName = (name?: string) => {
        if (name && name.length) {
            return name;
        }
        return 'unnamed';
    }

    const getTypeLabel = (value: GateValueModel) => {
        return (
            <div>
                {getName(value.name)}
                {value.gateValue.type ? <div className={styles.valueLabel}>{value.gateValue.type.toUpperCase()}</div> : ''}
            </div>
        )
    }

    const deviceOptions: SelectedOption[] = useMemo(() => {
        const options: SelectedOption[] = devices.map((device) => {
            return {value: device, label: getName(device.name.value)}
        })
        options.unshift({value: undefined, label: '-- select device --'});
        return options;
    }, [devices]);

    const valueOptions: SelectedOption[] = useMemo(() => {
        const options: SelectedOption[] = values.map((value) => {
            return {value: value, label: getTypeLabel(value)}
        });
        options.unshift({value: undefined, label: '-- select value --'});
        return options;
    }, [values]);

    const onDeviceChange = (selected: SelectedOption) => {
        setSelectedDevice(selected.value as DeviceModel);
        setDeviceOption(selected);
    }

    const onValueChange = (selected: SelectedOption) => {
        setSelectedValue(selected.value as GateValueModel);
        setValueOption(selected);
    }

    useEffect(() => {
        if (deviceOption === undefined) {
            setDeviceOption(deviceOptions[0]);
        }
    }, [devices]);

    useEffect(() => {
        if (valueOption === undefined) {
            setValueOption(valueOptions[0]);
        }
    }, [devices]);

    return (
        <div className={styles.valueSelectContainer}>
            <Select
                className={styles.selectInput}
                options={deviceOptions}
                value={deviceOption}
                onChange={(selected) => onDeviceChange(selected as SelectedOption)}
            />
            <Select
                className={styles.selectInput}
                options={valueOptions}
                value={valueOption}
                onChange={(selected) => onValueChange(selected as SelectedOption)}
            />
        </div>
    )
}

export default ValueSelect;
