import {DeviceModel, GateValueModel, SystemModel} from "@stargate-system/model";
import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {AddressMapper, Directions, ValueTypes} from "@stargate-system/core";

export interface CreatePipeModel {
    devices: DeviceModel[],
    values: GateValueModel[],
    selectedGroup: string | null | undefined,
    setSelectedGroup: Dispatch<SetStateAction<string | null | undefined>>
    selectedDevice: DeviceModel | undefined,
    setSelectedDevice: Dispatch<SetStateAction<DeviceModel | undefined>>,
    selectedValue: GateValueModel | undefined,
    setSelectedValue: Dispatch<SetStateAction<GateValueModel | undefined>>,
    exclude: (value?: GateValueModel, device?: DeviceModel) => void
}

const useCreatePipeModel = (systemModel: SystemModel, excludeOutputs: boolean = false): CreatePipeModel => {
    const [excludedValue, setExcludedValue] = useState<GateValueModel | undefined>();
    const [excludedDevice, setExcludedDevice] = useState<DeviceModel | undefined>();
    const [devices, setDevices] = useState<DeviceModel[]>([]);
    const [values, setValues] = useState<GateValueModel[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null | undefined>();
    const [selectedDevice, setSelectedDevice] = useState<DeviceModel | undefined>();
    const [selectedValue, setSelectedValue] = useState<GateValueModel | undefined>();

    const isCompatible = (value1: GateValueModel, value2: GateValueModel) => {
        const id1 = AddressMapper.extractTargetId(value1.id)[0];
        const id2 = AddressMapper.extractTargetId(value2.id)[0];
        if (id1 === id2) {
            return false;
        }
        if ((value1.gateValue.type === ValueTypes.integer) || (value1.gateValue.type === ValueTypes.float)) {
            return (value2.gateValue.type === ValueTypes.integer) || (value2.gateValue.type === ValueTypes.float);
        }
        return value1.gateValue.type === value2.gateValue.type;
    }

    const availableDevices = useMemo(() => {
        const filteredDevices = systemModel.devices.values.filter((device) => {
            return (device.id !== excludedDevice?.id) &&
                ((selectedGroup === undefined) || (device.group.value === (selectedGroup === null ? undefined : selectedGroup)))
        });

        if (selectedDevice && !filteredDevices.find((device) => device.id === selectedDevice.id)) {
            setSelectedDevice(undefined);
        }

        return filteredDevices;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [systemModel, excludedDevice, selectedGroup]);

    const availableValues = useMemo(() => {
        let valuesByDevice: GateValueModel[] = [];
        availableDevices.forEach((device) => valuesByDevice.push(...device.gateValues.values));
        valuesByDevice = valuesByDevice.filter((value) =>
            (!excludeOutputs || (value.gateValue.direction !== Directions.output))
            && (!selectedDevice || selectedDevice.gateValues.find((valueOnSelected) => value.id === valueOnSelected.id))
        );
        if (excludedValue) {
            const alreadyPiped: string[] = [];
            systemModel.pipes.forEach((pipe) => {
                if (pipe.source === excludedValue.id) {
                    alreadyPiped.push(pipe.target);
                } else if (pipe.target === excludedValue.id) {
                    alreadyPiped.push(pipe.source);
                }
            });
            valuesByDevice = valuesByDevice.filter((value) =>
                (value.id !== excludedValue.id)
                && isCompatible(value, excludedValue)
                && !alreadyPiped.find((id) => id === value.id)
            );
        }
        if (selectedValue && !valuesByDevice.find((value) => value.id === selectedValue.id)) {
            setSelectedValue(undefined);
        }
        return valuesByDevice;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableDevices, excludedValue, selectedDevice]);

    const exclude = (valueToExclude?: GateValueModel, deviceToExclude?: DeviceModel) => {
        setExcludedValue(valueToExclude);
        setExcludedDevice(deviceToExclude);
    }

    useEffect(() => {
        setDevices(availableDevices);
    }, [availableDevices]);

    useEffect(() => {
        setValues(availableValues);
    }, [availableValues]);

    return {
        devices,
        values,
        selectedGroup,
        setSelectedGroup,
        selectedDevice,
        setSelectedDevice,
        selectedValue,
        setSelectedValue,
        exclude
    }
}

export default useCreatePipeModel;
