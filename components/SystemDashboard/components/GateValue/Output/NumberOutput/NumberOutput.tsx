import {GateNumber} from "gate-core";
import {useEffect, useMemo, useState} from "react";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import NumberGeneric from "../../common/GenericNumber/NumberGeneric";
import ValueDisplay from "./components/ValueDisplay/ValueDisplay";

interface NumberInputProps {
    gateNumber: GateNumber,
    value: number,
    isActive: boolean
}

const NumberOutput = (props: NumberInputProps) => {
    const {gateNumber, value, isActive} = props;

    const [isLimited, setIsLimited] = useState(false);

    const rangePercent = useMemo(() => {
        if (gateNumber && isLimited && value !== undefined) {
            // @ts-ignore
            const fullRange = gateNumber.range[1] - gateNumber.range[0];
            // @ts-ignore
            return (100 * (value - gateNumber.range[0])) / fullRange;
        }
        return undefined;
    }, [gateNumber, isLimited, value]);

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
        valueBar={<ProgressBar percentFull={rangePercent} isActive={isActive}/>}
        valueDisplay={<ValueDisplay value={value} isLimited={isLimited}/>}
    />
}

export default NumberOutput;
