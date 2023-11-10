import {useEffect, useState} from "react";
import {GateNumber} from "gate-core";
import {ObservableValue} from "../../../../model/ObservableValue";

interface UnlimitedNumberInputProps {
    registeredGateNumber: ObservableValue<GateNumber>
}

const UnlimitedNumberInput = (props: UnlimitedNumberInputProps) => {
    const {registeredGateNumber} = props;
    const [subscribedValueKey, setSubscribedValueKey] = useState<string>();
    const [value, setValue] = useState<number | undefined>(registeredGateNumber.gateValue.value ?? 0);

    useEffect(() => {
        if (subscribedValueKey === undefined) {
            const key = registeredGateNumber.subscribe(() => setValue(registeredGateNumber.gateValue.value));
            setSubscribedValueKey(key);
        }
    }, [registeredGateNumber]);

    useEffect(() => {
        return () => {
            if (subscribedValueKey !== undefined) {
                registeredGateNumber.unsubscribe(subscribedValueKey);
            }
        };
    }, []);

    return (
        <div>
            {(value !== undefined) && <span>{value}</span>}
        </div>
    )
}

export default UnlimitedNumberInput;
