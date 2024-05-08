import React, {useEffect, useMemo, useState} from "react";
import styles from './ValueSelect.module.css';
import {DeviceModel, GateValueModel} from "@stargate-system/model";
import Select from 'react-select';
import {
    CreatePipeModel
} from "@/components/SystemPage/CardDisplay/cards/PipesDashboard/components/NewPipeModal/useCreatePipeModel";

interface ValueSelectProps {
    model: CreatePipeModel,
    groups: string[]
}

interface SelectedOption {
    value?: DeviceModel | GateValueModel,
    label: string | React.JSX.Element,
    name?: string
}

interface GroupOption {
    label: string,
    value: string | undefined | null
}

const ValueSelect = (props: ValueSelectProps) => {
    const {model, groups} = props;

    const {
        devices,
        values,
        setSelectedGroup,
        selectedDevice,
        setSelectedDevice,
        selectedValue,
        setSelectedValue} = model;

    const [groupOption, setGroupOption] = useState<GroupOption | null>();
    const [deviceOption, setDeviceOption] = useState<SelectedOption | null>(null);
    const [valueOption, setValueOption] = useState<SelectedOption | null>(null);

    const getName = (name?: string) => {
        if (name && name.length) {
            return name;
        }
        return 'unnamed';
    }

    const getTypeLabel = (value: GateValueModel) => {
        return (
            <div>
                {getName(value.gateValue.valueName)}
                {value.gateValue.type ? <div className={styles.valueLabel}>{value.gateValue.type.toUpperCase()}</div> : ''}
            </div>
        )
    }

    const groupOptions: GroupOption[] = useMemo(() => {
        return [
            {label: '-- none --', value: undefined},
            {label: 'Without group', value: null},
            ...groups.map((group) => {
                return {label: group, value: group}
            })
        ]
    }, [groups]);

    const deviceOptions: SelectedOption[] = useMemo(() => {
        const options: SelectedOption[] = devices.map((device) => {
            return {value: device, label: getName(device.name.value)}
        })
        options.unshift({value: undefined, label: '-- none --'});
        return options;
    }, [devices]);

    const emptyOption = useMemo<SelectedOption>(() => {
        return {value: undefined, label: '-- none --'};
    }, []);

    const valueOptions: SelectedOption[] = useMemo(() => {
        const options: SelectedOption[] = values.map((value) => {
            return {value: value, label: getTypeLabel(value), name: value.gateValue.valueName}
        });
        options.unshift(emptyOption);
        return options;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const onGroupChange = (selected: GroupOption) => {
        setSelectedGroup(selected.value);
        setGroupOption(selected.value === undefined ? null : selected);
    }

    const onDeviceChange = (selected: SelectedOption) => {
        const device = selected.value ? selected.value as DeviceModel : undefined;
        setSelectedDevice(device);
        setDeviceOption(selected.value ? selected : null);
    }

    const onValueChange = (selected: SelectedOption) => {
        setSelectedValue(selected.value ? selected.value as GateValueModel : undefined);
        setValueOption(selected.value ? selected : null);
    }

    useEffect(() => {
        if (selectedValue === undefined) {
            setValueOption(null);
        }
    }, [selectedValue]);

    useEffect(() => {
        if (selectedDevice === undefined) {
            setDeviceOption(null);
        }
    }, [selectedDevice]);

    return (
        <div className={styles.valueSelectContainer}>
            {(groups.length > 0) &&
                <Select
                    className={styles.selectInput}
                    options={groupOptions}
                    value={groupOption}
                    onChange={(selected) => onGroupChange(selected as GroupOption)}
                    placeholder={'Filter by group...'}
                />
            }
            <Select
                className={styles.selectInput}
                options={deviceOptions}
                value={deviceOption}
                onChange={(selected) => onDeviceChange(selected as SelectedOption)}
                placeholder={'Filter by device...'}
            />
            <Select
                className={styles.selectInput}
                options={valueOptions}
                value={valueOption}
                getOptionValue={(option) => option.name ?? ''}
                onChange={(selected) => onValueChange(selected as SelectedOption)}
                placeholder={'Select value...'}
            />
        </div>
    )
}

export default ValueSelect;
