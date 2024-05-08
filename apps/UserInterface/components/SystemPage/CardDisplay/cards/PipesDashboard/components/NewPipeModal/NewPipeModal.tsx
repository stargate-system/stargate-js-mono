import {SystemModel} from "@stargate-system/model";
import StandardModal from "@/components/common/modals/StandardModal/StandardModal";
import React, {useEffect, useMemo, useState} from "react";
import styles from './NewPipeModal.module.css';
import ValueSelect from "./components/ValueSelect/ValueSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import useCreatePipeModel
    from "@/components/SystemPage/CardDisplay/cards/PipesDashboard/components/NewPipeModal/useCreatePipeModel";

interface NewPipeModalProps {
    systemModel: SystemModel
}

const NewPipeModal = (props: NewPipeModalProps) => {
    const {systemModel} = props;
    const [confirmDisabled, setConfirmDisabled] = useState(true);
    const source = useCreatePipeModel(systemModel);
    const target = useCreatePipeModel(systemModel, true);
    const {selectedValue: sourceValue, selectedDevice: sourceDevice, exclude: excludeOnSource} = source;
    const {selectedValue: targetValue, selectedDevice: targetDevice, exclude: excludeOnTarget} = target;

    const groups = useMemo(() => {
        const groupNames = new Set(systemModel.devices.values.map((device) => device.group.value));
        const result: string[] = [];
        groupNames.forEach((name) => {
            if (name !== undefined) {
                result.push(name);
            }
        });
        return result;
    }, [systemModel]);

    const onCreatePipe = () => {
        if (sourceValue && targetValue) {
            systemModel.createPipe([sourceValue.id, targetValue.id]);
        }
    }

    useEffect(() => {
        excludeOnTarget(sourceValue, sourceDevice);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceValue, sourceDevice]);

    useEffect(() => {
        excludeOnSource(targetValue, targetDevice);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetValue, targetDevice]);

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
                    model={source}
                    groups={groups}
                />
                <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowDown}/>
                <ValueSelect
                    model={target}
                    groups={groups}
                />
            </div>
        </StandardModal>
    )
}

export default NewPipeModal;
