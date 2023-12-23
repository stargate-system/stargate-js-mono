import {DeviceModel, GateValueModel, SystemModel} from "gate-viewmodel";
import StandardModal from "../../../SystemDashboard/components/StandardModal/StandardModal";
import React, {useEffect, useState} from "react";
import styles from './NewPipeModal.module.css';
import ValueSelect from "./components/ValueSelect/ValueSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import {AddressMapper} from "gate-core";

interface NewPipeModalProps {
    systemModel: SystemModel
}

const NewPipeModal = (props: NewPipeModalProps) => {
    const {systemModel} = props;
    const [confirmDisabled, setConfirmDisabled] = useState(true);
    const [sourceDevices, setSourceDevices] = useState<DeviceModel[]>([]);
    const [sourceValues, setSourceValues] = useState<GateValueModel[]>([]);
    const [sourceDevice, setSourceDevice] = useState<DeviceModel | undefined>();
    const [sourceValue, setSourceValue] = useState<GateValueModel | undefined>();
    const [targetDevices, setTargetDevices] = useState<DeviceModel[]>([]);
    const [targetValues, setTargetValues] = useState<GateValueModel[]>([]);
    const [targetDevice, setTargetDevice] = useState<DeviceModel | undefined>();
    const [targetValue, setTargetValue] = useState<GateValueModel | undefined>();

    const getDevices = (excluded?: DeviceModel): DeviceModel[] => {
        let filteredDevices = systemModel.devices.values;
        if (excluded) {
            filteredDevices = filteredDevices.filter((device) => excluded.id !== device.id);
        }
        return filteredDevices;
    }

    const getAvailableValues = (excludedDevice?: DeviceModel) => {
        const availableValues: GateValueModel[] = [];
        systemModel.devices.values.forEach((device) => {
            if (!excludedDevice || excludedDevice.id !== device.id) {
                device.gateValues.values.forEach((value) => {
                    availableValues.push(value);
                });
            }
        });
        return availableValues;
    }

    const getSourceValues = () => {
        let excludedDevice: DeviceModel | undefined = sourceDevice;
        if (sourceValue) {
            excludedDevice = sourceDevices.find((device) => AddressMapper.extractTargetId(sourceValue.id)[0] === device.id);
        }
        return getAvailableValues(excludedDevice);
    }

    const getTargetValues = () => {
        let excludedDevice: DeviceModel | undefined = targetDevice;
        if (targetValue) {
            excludedDevice = targetDevices.find((device) => AddressMapper.extractTargetId(targetValue.id)[0] === device.id);
        }
        return getAvailableValues(excludedDevice);
    }

    useEffect(() => {
        setSourceDevices(getDevices(targetDevice));
        setSourceValues(getSourceValues());
    }, [targetDevice]);

    useEffect(() => {
        setTargetDevices(getDevices(sourceDevice));
        setTargetValues(getTargetValues());
    }, [sourceDevice]);

    useEffect(() => {
        setConfirmDisabled(!(sourceValue && targetValue));
        setTargetValues(getTargetValues());
    }, [sourceValue]);

    useEffect(() => {
        setConfirmDisabled(!(sourceValue && targetValue));
        setSourceValues(getSourceValues());
    }, [targetValue]);

    return (
        <StandardModal
            onApprove={() => {}}
            approveDisabled={confirmDisabled}
            approveLabel={'Create'}
        >
            Create pipe
            <div className={styles.newPipeModalBodyContainer}>
                <ValueSelect
                    devices={sourceDevices}
                    values={sourceValues}
                    setSelectedDevice={setSourceDevice}
                    setSelectedValue={setSourceValue}
                    typeFilter={targetValue?.gateValue.type}
                />
                <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowDown}/>
                <ValueSelect
                    devices={targetDevices}
                    values={targetValues}
                    setSelectedDevice={setTargetDevice}
                    setSelectedValue={setTargetValue}
                    typeFilter={sourceValue?.gateValue.type}
                    excludeOutput={true}
                />
            </div>
        </StandardModal>
    )
}

export default NewPipeModal;
