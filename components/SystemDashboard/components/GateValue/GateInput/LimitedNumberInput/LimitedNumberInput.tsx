import {RegisteredValue} from "../../../../model/RegisteredValue";
import {GateNumber} from "gate-core";
import UnlimitedNumberInput from "../UnlimitedNumberInput/UnlimitedNumberInput";
import styles from './LimitedNumberInput.module.css';

interface LimitedNumberInputProps {
    registeredGateNumber: RegisteredValue<GateNumber>
}
const LimitedNumberInput = (props: LimitedNumberInputProps) => {
    const {registeredGateNumber} = props;

    return (
        <div className={styles.limitedNumberInput}>
            <UnlimitedNumberInput registeredGateNumber={registeredGateNumber}/>
        </div>
    )
}

export default LimitedNumberInput;
