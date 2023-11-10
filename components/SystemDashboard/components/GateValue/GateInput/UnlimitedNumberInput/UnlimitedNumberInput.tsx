import {useEffect, useState} from "react";
import {GateNumber} from "gate-core";
import {ObservableValue} from "../../../../model/ObservableValue";
import {handleSubscription} from "../../helper";

interface UnlimitedNumberInputProps {
    registeredGateNumber: ObservableValue<GateNumber>
}

const UnlimitedNumberInput = (props: UnlimitedNumberInputProps) => {
    const {registeredGateNumber} = props;
    const [subscribedValueKey, setSubscribedValueKey] = useState<string>();
    const [value, setValue] = useState<number | undefined>(registeredGateNumber.gateValue.value);

    useEffect(() => {
        return handleSubscription(
            registeredGateNumber,
            subscribedValueKey,
            setSubscribedValueKey,
            () => setValue(registeredGateNumber.gateValue.value)
        );
    }, [registeredGateNumber]);

    return (
        <div>
            {(value !== undefined) && <span>{value}</span>}
        </div>
    )
}

export default UnlimitedNumberInput;
