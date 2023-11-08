import {GateNumber, Manifest, ValueTypes} from "gate-core";
import {useCallback} from "react";
import registries from "../../model/registries";
import LimitedNumberInput from "../GateInput/LimitedNumberInput/LimitedNumberInput";
import UnlimitedNumberInput from "../GateInput/UnlimitedNumberInput/UnlimitedNumberInput";

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
                    switch (registeredValue.gateValue.type) {
                        case ValueTypes.integer:
                        case ValueTypes.float:
                            const gateNumber = registeredValue.gateValue as GateNumber;
                            if (gateNumber.range) {
                                return <LimitedNumberInput registeredGateNumber={registeredValue}/>;
                            } else {
                                return <UnlimitedNumberInput registeredGateNumber={registeredValue}/>
                            }
                        case ValueTypes.boolean:
                            // TODO
                    }
                }
            })
        }
    }, [manifest]);

    return (
        <div>
            <p>{manifest.id + ' : ' + manifest.deviceName}</p>
            {generateValues()}
        </div>
    )
}

export default Device;
