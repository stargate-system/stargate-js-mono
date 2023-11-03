import styles from './ByteInput.module.css';
import globalStyles from '../../../../../../components/globalStyles.module.css';
import {ChangeEvent, Dispatch, FocusEventHandler, SetStateAction} from "react";

interface ByteInputProps {
    byteValue?: string,
    setByteValue?: Dispatch<SetStateAction<string>>,
    byteValid?: boolean,
    onBlur?: FocusEventHandler,
    disabled?: boolean,
}

const ByteInput = (props: ByteInputProps) => {
    const {
        byteValue = '',
        setByteValue = () => {},
        byteValid = true,
        onBlur = () => {},
        disabled = false,
    } = props;

    const getByteSetter = () => {
        return (ev: ChangeEvent<HTMLInputElement>) => {
            const value = ev.target.value.trim();
            if (/^\d{0,3}$/.test(value)) {
                setByteValue(value);
            }
        }
    }

    return <input type="text" inputMode="numeric" value={byteValue} onChange={getByteSetter()} disabled={disabled}
                  onBlur={onBlur} placeholder="xxx"
                  className={byteValid ? styles.ipField : `${styles.ipField} ${globalStyles.inputError}`}/>;
}

export default ByteInput;