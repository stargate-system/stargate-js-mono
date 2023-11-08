import {useEffect, useState} from "react";
import {GateNumber} from "gate-core";
import {RegisteredValue} from "../../../model/RegisteredValue";

interface UnlimitedNumberInputProps {
    registeredGateNumber: RegisteredValue<GateNumber>
}

const UnlimitedNumberInput = (props: UnlimitedNumberInputProps) => {
    const {registeredGateNumber} = props;
    const [subscribedValueKey, setSubscribedValueKey] = useState<string>();
    const [value, setValue] = useState<number | undefined>(registeredGateNumber.gateValue.value ?? 0);
    const [name, setName] = useState<string>();

    useEffect(() => {
        if (subscribedValueKey === undefined) {
            const key = registeredGateNumber.subscribe(() => setValue(registeredGateNumber.gateValue.value));
            setSubscribedValueKey(key);
        }
        setName(registeredGateNumber.gateValue.valueName);
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
            <p>{name}</p>
            {(value !== undefined) && <span>{value}</span>}
        </div>
    )
}

export default UnlimitedNumberInput;
