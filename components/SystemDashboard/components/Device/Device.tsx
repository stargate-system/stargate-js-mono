import {GateNumber, Manifest, ValueTypes} from "gate-core";
import {useCallback} from "react";
import registries from "../../model/registries";
import LimitedNumberInput from "../GateValue/GateInput/LimitedNumberInput/LimitedNumberInput";
import UnlimitedNumberInput from "../GateValue/GateInput/UnlimitedNumberInput/UnlimitedNumberInput";
import DeviceHeader from "./components/DeviceHeader/DeviceHeader";
import styles from './Device.module.css';
import GateValue from "../GateValue/GateValue";

interface DeviceProps {
    manifest: Manifest
}

const Device = (props: DeviceProps) => {
    const {manifest} = props;

    const generateValues = useCallback(() => {
        const values = manifest.values;
        if (values) {
            return values.map((valueManifest) => {
                const registeredValue = registries.gateValuesRegistry.getByKey(valueManifest.id);
                if (registeredValue) {
                    return <GateValue registeredGateValue={registeredValue}/>
                }
            })
        }
    }, [manifest]);

    return (
        <div className={styles.deviceContainer}>
            <DeviceHeader name={manifest.deviceName ?? ''}/>
            <div className={styles.valuesContainer}>
                {generateValues()}
            </div>
        </div>
    )
}

export default Device;
