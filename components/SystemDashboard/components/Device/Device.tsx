import {Manifest} from "gate-core";
import {useCallback, useEffect, useState} from "react";
import registries from "../../model/registries";
import DeviceHeader from "./components/DeviceHeader/DeviceHeader";
import styles from './Device.module.css';
import GateValue from "../GateValue/GateValue";

interface DeviceProps {
    manifest: Manifest
}

const Device = (props: DeviceProps) => {
    const {manifest} = props;

    const [isActive, setIsActive] = useState(false);
    const [deviceStateListenerKey, setDeviceStateListenerKey] = useState<string>();

    const generateValues = useCallback(() => {
        const values = manifest.values;
        if (values) {
            return values.map((valueManifest) => {
                const registeredValue = registries.gateValuesRegistry.getByKey(valueManifest.id);
                if (registeredValue) {
                    return <GateValue isActive={isActive} registeredGateValue={registeredValue}/>
                }
            })
        }
    }, [manifest]);

    useEffect(() => {
        // @ts-ignore
        const deviceState = registries.deviceStateRegistry.getByKey(manifest.id);
        if (deviceState) {
            setIsActive(deviceState.isActive);
            if (deviceStateListenerKey !== undefined) {
                deviceState.unsubscribe(deviceStateListenerKey);
            }
            const key = deviceState.subscribe(() => setIsActive(deviceState.isActive));
            setDeviceStateListenerKey(key);
        }
        return () => {
            // @ts-ignore
            const deviceState = registries.deviceStateRegistry.getByKey(manifest.id);
            if (deviceState && deviceStateListenerKey) {
                deviceState.unsubscribe(deviceStateListenerKey);
            }
        }
    }, [manifest]);

    return (
        <div className={`${styles.deviceContainer} ${isActive ? styles.active : styles.inactive}`}>
            <DeviceHeader name={manifest.deviceName ?? ''}/>
            <div className={styles.valuesContainer}>
                {generateValues()}
            </div>
        </div>
    )
}

export default Device;
