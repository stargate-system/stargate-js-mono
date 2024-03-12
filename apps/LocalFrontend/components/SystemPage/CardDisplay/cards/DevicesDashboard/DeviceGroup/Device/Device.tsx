import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import DeviceHeader from "./components/DeviceHeader/DeviceHeader";
import styles from './Device.module.css';
import GateValueWrapper
    from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DeviceGroup/Device/GateValue/GateValueWrapper";
import {DeviceModel, DeviceState, GateValueModel} from "gate-viewmodel";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import useModelMap from "@/components/ReactGateViewModel/hooks/useModelMap";
import {ValueVisibility} from "gate-core";
import {Categories, localStorageHelper} from "@/helper/localStorageHelper";

const customMatchers: CustomDeviceMatcher[] = [
    // put device values customizations here
]

export interface CustomDeviceMatcher {
    isCustom: (deviceModel: DeviceModel) => boolean,
    filterValues: (values: GateValueModel[]) => GateValueModel[],
    getInstance: (key: string, deviceModel: DeviceModel) => ReactNode
}

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
        let customFilteredValues = [...values];
        const customElementGetters: Array<(key: string, deviceModel: DeviceModel) => ReactNode> = [];
        customMatchers.forEach((matcher) => {
            if (matcher.isCustom(deviceModel)) {
                customFilteredValues = matcher.filterValues(customFilteredValues);
                customElementGetters.push(matcher.getInstance);
            }
        });

        const elements: ReactNode[] = customElementGetters.map((getter, index) => getter(index.toString(), deviceModel));
        customFilteredValues.filter((value) => {
                const isSettings = value.gateValue.visibility === ValueVisibility.settings.toString();
                const isHidden = value.gateValue.visibility === ValueVisibility.hidden.toString();
                return !(isSettings || isHidden);
            })
            .forEach((valueModel) => {
                elements.push(<GateValueWrapper key={valueModel.id + Date.now()} valueModel={valueModel}/>);
            });

        return elements
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
