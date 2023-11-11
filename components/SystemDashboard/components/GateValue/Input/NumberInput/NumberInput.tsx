import {GateNumber} from "gate-core";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import NumberGeneric from "../../common/GenericNumber/NumberGeneric";
import ValueDisplay from "./components/ValueDisplay/ValueDisplay";

interface NumberInputProps {
    gateNumber: GateNumber,
    value: number,
    setValue: Dispatch<SetStateAction<number>>,
    isActive: boolean
}

const NumberInput = (props: NumberInputProps) => {
    const {gateNumber, value, setValue, isActive} = props;

    const [isLimited, setIsLimited] = useState(false);

    const setGateValue = (value: number) => {
        setValue(value);
        gateNumber.setValue(value);
    }

    useEffect(() => {
        if (gateNumber &&
            typeof gateNumber.range[0] === "number" &&
            typeof gateNumber.range[1] === "number") {
            setIsLimited(true);
        }
    }, [gateNumber]);

    return <NumberGeneric
        gateNumber={gateNumber}
        value={value}
        isActive={isActive}
        valueBar={<div/>}
        valueDisplay={<ValueDisplay value={value} setValue={setGateValue}/>}
        isLimited={isLimited}
    />
}

export default NumberInput;
