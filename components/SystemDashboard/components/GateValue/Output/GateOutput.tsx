import {ObservableValue} from "../../../model/ObservableValue";
import {useEffect, useState} from "react";
import {ValueTypes} from "gate-core";
import NumberOutput from "./NumberOutput/NumberOutput";
import {handleSubscription} from "../helper";

interface GateOutputProps {
    registeredGateValue: ObservableValue<any>,
    isActive: boolean
}

const GateOutput = (props: GateOutputProps) => {
    const {registeredGateValue, isActive} = props;

    const [subscribedValueKey, setSubscribedValueKey] = useState<string>();
    const [value, setValue] = useState(registeredGateValue.gateValue.value);

    useEffect(() => {
        return handleSubscription(
            registeredGateValue,
            subscribedValueKey,
            setSubscribedValueKey,
            () => setValue(registeredGateValue.gateValue.value)
        );
    }, [registeredGateValue]);

    switch (registeredGateValue.gateValue.type) {
        case ValueTypes.integer:
        case ValueTypes.float:
            return <NumberOutput value={value} isActive={isActive} gateNumber={registeredGateValue.gateValue}/>;
        case ValueTypes.boolean:
        // TODO
    }
}

export default GateOutput;
