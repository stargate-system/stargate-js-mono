import {DeviceModel} from "gate-viewmodel";
import styles from './DeviceSettingsModal.module.css';
import GateValueWrapper from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DeviceGroup/Device/GateValue/GateValueWrapper";
import {ValueVisibility} from "gate-core";
import StandardModal from "@/components/common/modals/StandardModal/StandardModal";
import useModelMap from "@/components/ReactGateViewModel/hooks/useModelMap";
import {useContext, useMemo} from "react";
import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";

interface DeviceSettingsModalProps {
    deviceId: string
}

const DeviceSettingsModal = (props: DeviceSettingsModalProps) => {
    const {deviceId} = props;
    const systemModel = useContext(SystemModelContext);
    const devices = useModelMap<DeviceModel>(systemModel.devices);

    const currentModel = useMemo(() => {
        return devices.find((device) => device.id === deviceId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devices]);

    return (
        <StandardModal approveVisible={false} denyLabel={'Close'} header={'Device settings'}>
            <div className={styles.valuesContainer}>
                {currentModel?.gateValues.values
                    .filter((value) => value.gateValue.visibility === ValueVisibility.settings)
                    .map((value) => <GateValueWrapper key={value.id} valueModel={value}/>)}
            </div>
        </StandardModal>
    )
}

export default DeviceSettingsModal;
