import styles from './IpInput.module.css';
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import ByteInput from "@/pages/ScannerPage/components/ByteInput/ByteInput";

interface IpInputProps {
    byte1: string,
    setByte1: Dispatch<SetStateAction<string>>,
    byte2: string,
    setByte2: Dispatch<SetStateAction<string>>,
    byte3: string,
    setByte3: Dispatch<SetStateAction<string>>,
    setIpValid: Dispatch<SetStateAction<boolean>>,
    scanInProgress: boolean
}

const IpInput = (props: IpInputProps) => {
    const {
        byte1,
        setByte1,
        byte2,
        setByte2,
        byte3,
        setByte3,
        setIpValid,
        scanInProgress
    } = props

    const [byte1Valid, setByte1Valid] = useState(true);
    const [byte1Disabled, setByte1Disabled] = useState(false);
    const [byte2Valid, setByte2Valid] = useState(true);
    const [byte2Disabled, setByte2Disabled] = useState(true);
    const [byte3Valid, setByte3Valid] = useState(true);
    const [byte3Disabled, setByte3Disabled] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

    const validateByte1 = () => {
        if (byte1 === '192') {
            setByte2('168');
            setByte2Disabled(true);
        } else if (byte1 !== '10' && byte1 !== '172') {
            setByte1Valid(false);
            setValidationMessage('Only allowed values are 10, 172 or 192');
        } else {
            setByte2Disabled(false);
            validateByte2();
        }
    }

    const validateByte2 = () => {
        const value = Number.parseInt(byte2);
        if (Number.isInteger(value)) {
            switch (byte1) {
                case '10':
                    if (value < 0 || value > 255) {
                        setByte2Valid(false);
                        setValidationMessage('Allowed range is 0-255');
                    }
                    break;
                case '172':
                    if (value < 16 || value > 32) {
                        setByte2Valid(false);
                        setValidationMessage('Allowed range is 16-32');
                    }
            }
        } else {
            setByte2Valid(false);
            setValidationMessage('Invalid value');
        }
    }

    const validateByte3 = () => {
        const value = Number.parseInt(byte3);
        if (value < 0 || value > 255) {
            setByte3Valid(false);
            setValidationMessage('Value must be within 0-255 or empty');
        }
    }

    const setBytesAvailability = () => {
        if (byte1Valid && byte2Valid && byte3Valid) {
            setByte1Disabled(false);
            setByte2Disabled(byte1 === '192');
            setByte3Disabled(false);
            setIpValid(true);
        } else {
            setByte1Disabled(byte1Valid);
            setByte2Disabled(byte2Valid);
            setByte3Disabled(byte3Valid);
            setIpValid(false);
        }
    }

    useEffect(() => {
        setBytesAvailability();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [byte1Valid, byte2Valid, byte3Valid]);

    useEffect(() => {
        setByte1Valid(true);
        setByte2Valid(true);
        setByte3Valid(true);
        setValidationMessage('');
    }, [byte1, byte2, byte3]);

    useEffect(() => {
        if (scanInProgress) {
            setByte1Disabled(true);
            setByte2Disabled(true);
            setByte3Disabled(true);
        } else {
            setBytesAvailability();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanInProgress]);

    return (
        <div className={styles.ipComponentContainer}>
            <div className={styles.ipContainer}>
                <ByteInput byteValue={byte1} setByteValue={setByte1} byteValid={byte1Valid}
                           onBlur={validateByte1} disabled={byte1Disabled}/>
                .
                <ByteInput byteValue={byte2} setByteValue={setByte2} byteValid={byte2Valid}
                           onBlur={validateByte2} disabled={byte2Disabled}/>
                .
                <ByteInput byteValue={byte3} setByteValue={setByte3} byteValid={byte3Valid}
                           onBlur={validateByte3} disabled={byte3Disabled}/>
                .
                <ByteInput disabled={true}/>
            </div>
            <p className={styles.validationMessage}>{validationMessage}</p>
        </div>
    )
}

export default IpInput;