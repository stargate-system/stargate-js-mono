import {DeviceModel, GateValueModel, SystemModel} from "gate-viewmodel";
import StandardModal from "../../../ModalComponent/StandardModal/StandardModal";
import React, {useEffect, useState} from "react";
import styles from './NewPipeModal.module.css';
import ValueSelect from "./components/ValueSelect/ValueSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import {AddressMapper, EventName} from "gate-core";

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

    const getAvailableValues = (includedDevice?: DeviceModel, excludedDevice?: DeviceModel, excludedValue?: GateValueModel) => {
        const availableValues: GateValueModel[] = [];
        if (includedDevice) {
            includedDevice.gateValues.values.forEach((value) => availableValues.push(value));
        } else {
            systemModel.devices.values.forEach((device) => {
                if (!excludedDevice || excludedDevice.id !== device.id) {
                    device.gateValues.values.forEach((value) => {
                        if (value.id !== excludedValue?.id) {
                            availableValues.push(value);
                        }
                    });
                }
            });
        }
        if (excludedValue) {
            const relevantPipes = systemModel.pipes.values
                .filter((pipe) => pipe.source === excludedValue.id || pipe.target === excludedValue.id);
            return availableValues.filter((value) => {
                return !relevantPipes.find((pipe) => pipe.source === value.id || pipe.target === value.id);
            })
        }
        return availableValues;
    }

    const getTargetValues = () => {
        let excludedDevice: DeviceModel | undefined = sourceDevice;
        if (sourceValue) {
            excludedDevice = sourceDevices.find((device) => AddressMapper.extractTargetId(sourceValue.id)[0] === device.id);
        }
        return getAvailableValues(targetDevice, excludedDevice, sourceValue);
    }

    const getSourceValues = () => {
        let excludedDevice: DeviceModel | undefined = targetDevice;
        if (targetValue) {
            excludedDevice = targetDevices.find((device) => AddressMapper.extractTargetId(targetValue.id)[0] === device.id);
        }
        return getAvailableValues(sourceDevice, excludedDevice, targetValue);
    }

    const onCreatePipe = () => {
        if (sourceValue && targetValue) {
            systemModel.systemConnector.sendDeviceEvent(EventName.pipeCreated, [sourceValue.id, targetValue.id]);
        }
    }

    useEffect(() => {
        setSourceDevices(getDevices(targetDevice));
        setTargetDevices(getDevices(sourceDevice));
        setSourceValues(getSourceValues());
        setTargetValues(getTargetValues());
    }, [targetDevice, sourceDevice, targetValue, sourceValue]);

    useEffect(() => {
        setConfirmDisabled(!(sourceValue && targetValue));
    }, [sourceValue, targetValue]);

    return (
        <StandardModal
            onApprove={onCreatePipe}
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
