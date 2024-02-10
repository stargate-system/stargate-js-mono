import {DeviceModel} from "gate-viewmodel";
import styles from './DeviceSettingsModal.module.css';
import GateValueWrapper from "../../DevicesDashboard/GateValue/GateValueWrapper";
import {Directions, ValueVisibility} from "gate-core";
import StandardModal from "../StandardModal/StandardModal";

interface DeviceSettingsModalProps {
    deviceModel: DeviceModel
}

const DeviceSettingsModal = (props: DeviceSettingsModalProps) => {
    const {deviceModel} = props;

    return (
        <StandardModal approveVisible={false} denyLabel={'Close'} header={'Device settings'}>
            <div className={styles.valuesContainer}>
                {deviceModel.gateValues.values
                    .filter((value) => (value.gateValue.visibility === ValueVisibility.settings) && (value.gateValue.direction === Directions.input))
                    .map((value) => <GateValueWrapper key={value.id} valueModel={value}/>)}
            </div>
        </StandardModal>
    )
}

export default DeviceSettingsModal;
