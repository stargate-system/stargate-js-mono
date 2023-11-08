import {RegisteredValue} from "../../../model/RegisteredValue";
import {GateNumber} from "gate-core";
import UnlimitedNumberInput from "../UnlimitedNumberInput/UnlimitedNumberInput";

interface LimitedNumberInputProps {
    registeredGateNumber: RegisteredValue<GateNumber>
}
const LimitedNumberInput = (props: LimitedNumberInputProps) => {
    const {registeredGateNumber} = props;

    return (
        <div>
            <UnlimitedNumberInput registeredGateNumber={registeredGateNumber}/>
        </div>
    )
}

export default LimitedNumberInput;
