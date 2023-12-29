import React, {Dispatch, SetStateAction, useMemo, useState} from "react";
import styles from './ValueSelect.module.css';
import {DeviceModel, GateValueModel} from "gate-viewmodel";
import Select from 'react-select';
import {AddressMapper, Directions, ValueTypes} from "gate-core";

interface ValueSelectProps {
    devices: DeviceModel[],
    values: GateValueModel[],
    setSelectedDevice: Dispatch<SetStateAction<DeviceModel | undefined>>,
    setSelectedValue: Dispatch<SetStateAction<GateValueModel | undefined>>,
    typeFilter?: string,
    excludeOutput?: boolean
}

interface SelectedOption {
    value?: DeviceModel | GateValueModel,
    label: string | React.JSX.Element,
    name?: string
}

const ValueSelect = (props: ValueSelectProps) => {
    const {
        devices,
        values,
        setSelectedDevice,
        setSelectedValue,
        typeFilter,
        excludeOutput = false
    } = props;

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
                {getName(value.name)}
                {value.gateValue.type ? <div className={styles.valueLabel}>{value.gateValue.type.toUpperCase()}</div> : ''}
            </div>
        )
    }

    const getCompatibleTypes = (): Array<string | undefined> => {
        if (typeFilter === ValueTypes.float || typeFilter === ValueTypes.integer) {
            return [ValueTypes.float, ValueTypes.integer];
        }
        return [typeFilter];
    }

    const deviceOptions: SelectedOption[] = useMemo(() => {
        const options: SelectedOption[] = devices.map((device) => {
            return {value: device, label: getName(device.name.value)}
        })
        options.unshift({value: undefined, label: '-- none --'});
        return options;
    }, [devices]);

    const filterByType = (values: GateValueModel[]) => {
        if (typeFilter) {
            const compatibleTypes = getCompatibleTypes();
            return values.filter((value) => {
                return !!compatibleTypes.find((type) => type === value.gateValue.type);
            });
        }
        return values;
    }

    const emptyOption = useMemo<SelectedOption>(() => {
        return {value: undefined, label: '-- none --'};
    }, []);

    const valueOptions: SelectedOption[] = useMemo(() => {
        let options: SelectedOption[];
        options = filterByType(values).map((value) => {
            return {value: value, label: getTypeLabel(value), name: value.name}
        });
        if (excludeOutput) {
            options = options.filter(option => (option.value as GateValueModel).gateValue.direction !== Directions.output)
        }
        options.unshift(emptyOption);
        return options;
    }, [values, deviceOption, typeFilter]);

    const onDeviceChange = (selected: SelectedOption) => {
        const device = selected.value ? selected.value as DeviceModel : undefined;
        setSelectedDevice(device);
        setDeviceOption(selected.value ? selected : null);
        if (!device || (valueOption && !device.gateValues.values.find((value) => value.id === valueOption.value?.id))) {
            onValueChange(emptyOption);
        }
    }

    const onValueChange = (selected: SelectedOption) => {
        if (selected.value) {
            const parentId = AddressMapper.extractTargetId(selected.value.id)[0];
            const deviceOption = deviceOptions.find((device) => device.value?.id === parentId);
            if (deviceOption) {
                onDeviceChange(deviceOption);
            }
        }
        setSelectedValue(selected.value ? selected.value as GateValueModel : undefined);
        setValueOption(selected.value ? selected : null);
    }

    return (
        <div className={styles.valueSelectContainer}>
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
