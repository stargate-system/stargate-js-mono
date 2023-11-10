import {ObservableValue} from "../../../../model/ObservableValue";
import {GateNumber} from "gate-core";
import UnlimitedNumberInput from "../UnlimitedNumberInput/UnlimitedNumberInput";
import styles from './LimitedNumberInput.module.css';

interface LimitedNumberInputProps {
    registeredGateNumber: ObservableValue<GateNumber>
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
