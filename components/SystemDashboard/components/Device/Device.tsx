import {useCallback, useEffect, useMemo, useState} from "react";
import DeviceHeader from "./components/DeviceHeader/DeviceHeader";
import styles from './Device.module.css';
import GateValueWrapper from "../GateValue/GateValueWrapper";
import {DeviceModel, DeviceState} from "gate-viewmodel";
import useModelValue from "../../../ReactGateViewModel/hooks/useModelValue";
import useModelMap from "../../../ReactGateViewModel/hooks/useModelMap";

interface DeviceProps {
    deviceModel: DeviceModel
}

const Device = (props: DeviceProps) => {
    const {deviceModel} = props;

    const deviceState = useModelValue<DeviceState>(deviceModel.state);
    const [isActive, setIsActive] = useState(deviceState === DeviceState.up);
    const values = useModelMap(deviceModel.gateValues);

    const deviceContainerClass = useMemo(() => {
        return `${styles.deviceContainer} ${isActive ? styles.active : styles.inactive}`
    }, [isActive]);

    const generateValues = useCallback((isActive: boolean) => {
        return values.map((valueModel) => {
            return <GateValueWrapper key={valueModel.id + Date.now()} valueModel={valueModel} isActive={isActive}/>
        });
    }, []);

    useEffect(() => {
        setIsActive(deviceState === DeviceState.up);
    }, [deviceState]);

    return (
        <div className={deviceContainerClass}>
            <DeviceHeader deviceModel={deviceModel} isActive={isActive}/>
            <div className={styles.valuesContainer}>
                {generateValues(isActive)}
            </div>
        </div>
    )
}

export default Device;
