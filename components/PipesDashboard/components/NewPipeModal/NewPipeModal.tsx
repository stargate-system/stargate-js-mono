import {DeviceModel, GateValueModel, SystemModel} from "gate-viewmodel";
import StandardModal from "../../../SystemDashboard/components/StandardModal/StandardModal";
import React, {useEffect, useState} from "react";
import styles from './NewPipeModal.module.css';
import ValueSelect from "./components/ValueSelect/ValueSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";

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

    const getSourceDevices = (): DeviceModel[] => {
        return systemModel.devices.values;
    }

    const getSourceValues = () => {
        const availableValues: GateValueModel[] = [];
        systemModel.devices.values.forEach((device) => {
            device.gateValues.values.forEach((value) => {
                availableValues.push(value);
            })
        });
        return availableValues;
    }

    useEffect(() => {
        setSourceDevices(getSourceDevices());
        setSourceValues(getSourceValues());
        setTargetDevices(getSourceDevices());
        setTargetValues(getSourceValues());
    }, []);

    return (
        <StandardModal
            onApprove={() => {}}
            approveDisabled={confirmDisabled}
            approveLabel={'Create'}
        >
            <div className={styles.newPipeModalBodyContainer}>
                <ValueSelect
                    devices={sourceDevices}
                    values={sourceValues}
                    setSelectedDevice={setSourceDevice}
                    setSelectedValue={setSourceValue}
                />
                <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowDown}/>
                <ValueSelect
                    devices={targetDevices}
                    values={targetValues}
                    setSelectedDevice={setTargetDevice}
                    setSelectedValue={setTargetValue}
                />
            </div>
        </StandardModal>
    )
}

export default NewPipeModal;
