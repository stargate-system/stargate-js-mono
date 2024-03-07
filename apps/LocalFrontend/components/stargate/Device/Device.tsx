import {useCallback, useEffect, useMemo, useState} from "react";
import DeviceHeader from "./components/DeviceHeader/DeviceHeader";
import styles from './Device.module.css';
import GateValueWrapper from "@/components/stargate/GateValue/GateValueWrapper";
import {DeviceModel, DeviceState} from "gate-viewmodel";
import useModelValue from "@/components/stargate/ReactGateViewModel/hooks/useModelValue";
import useModelMap from "@/components/stargate/ReactGateViewModel/hooks/useModelMap";
import {ValueVisibility} from "gate-core";
import {Categories, localStorageHelper} from "@/helper/localStorageHelper";

interface DeviceProps {
    deviceModel: DeviceModel
}

const getInitialVisibility = (device: DeviceModel) => {
    const hasVisibleValues = device.gateValues.values
        .find((value) => (value.gateValue.visibility === undefined) || (value.gateValue.visibility === ValueVisibility.main));
    if (!hasVisibleValues) {
        return undefined;
    }
    return localStorageHelper.getVisibility(Categories.devices, device.id) ?? true
}

const Device = (props: DeviceProps) => {
    const {deviceModel} = props;

    const deviceState = useModelValue(deviceModel.state);
    const values = useModelMap(deviceModel.gateValues);
    const [isActive, setIsActive] = useState(deviceState === DeviceState.up);
    const [open, setOpen] = useState(getInitialVisibility(deviceModel));

    const deviceContainerClass = useMemo(() => {
        return `${styles.deviceContainer} ${isActive ? styles.active : styles.inactive}`
    }, [isActive]);

    const generateValues = useCallback(() => {
        return values
            .filter((value) => {
                const isSettings = value.gateValue.visibility === ValueVisibility.settings.toString();
                const isHidden = value.gateValue.visibility === ValueVisibility.hidden.toString();
                return !(isSettings || isHidden);
            })
            .map((valueModel) => {
                return <GateValueWrapper key={valueModel.id + Date.now()} valueModel={valueModel}/>
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleVisibility = () => {
        localStorageHelper.setVisibility(!open, Categories.devices, deviceModel.id);
        setOpen(!open);
    }

    useEffect(() => {
        setIsActive(deviceState === DeviceState.up);
    }, [deviceState]);

    return (
        <div className={deviceContainerClass}>
            <DeviceHeader deviceModel={deviceModel} isActive={isActive} open={open} toggleVisibility={toggleVisibility}/>
            {open &&
                <div className={styles.valuesContainer}>
                    {generateValues()}
                </div>
            }
        </div>
    )
}

export default Device;
