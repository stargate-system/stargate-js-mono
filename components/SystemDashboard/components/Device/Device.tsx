import {Manifest} from "gate-core";
import {useEffect, useMemo, useState} from "react";
import registries from "../../model/registries";
import DeviceHeader from "./components/DeviceHeader/DeviceHeader";
import styles from './Device.module.css';
import GateValue from "../GateValue/GateValue";
import {handleSubscription} from "../GateValue/helper";

interface DeviceProps {
    manifest: Manifest
}

const Device = (props: DeviceProps) => {
    const {manifest} = props;

    const [isActive, setIsActive] = useState(false);
    const [deviceStateListenerKey, setDeviceStateListenerKey] = useState<string>();

    const deviceContainerClass = useMemo(() => {
        return `${styles.deviceContainer} ${isActive ? styles.active : styles.inactive}`
    }, [isActive]);

    const generateValues = () => {
        const values = manifest.values;
        if (values) {
            return values.map((valueManifest) => {
                const registeredValue = registries.gateValuesRegistry.getByKey(valueManifest.id);
                if (registeredValue) {
                    return <GateValue isActive={isActive} registeredGateValue={registeredValue}/>
                }
            })
        }
    };

    useEffect(() => {
        // @ts-ignore
        const deviceState = registries.deviceStateRegistry.getByKey(manifest.id);
        // @ts-ignore
        return handleSubscription(deviceState, deviceStateListenerKey, setDeviceStateListenerKey, () => setIsActive(deviceState.isActive))
    }, [manifest]);

    return (
        <div className={deviceContainerClass}>
            <DeviceHeader name={manifest.deviceName ?? ''}/>
            <div className={styles.valuesContainer}>
                {generateValues()}
            </div>
        </div>
    )
}

export default Device;
