import styles from './IpInput.module.css';
import {useEffect, useState} from "react";
import ByteInput from "@/pages/ScannerPage/components/ByteInput/ByteInput";

const IpInput = () => {
    const [byte1, setByte1] = useState('192');
    const [byte1Valid, setByte1Valid] = useState(true);
    const [byte1Disabled, setByte1Disabled] = useState(false);
    const [byte2, setByte2] = useState('168');
    const [byte2Valid, setByte2Valid] = useState(true);
    const [byte2Disabled, setByte2Disabled] = useState(true);
    const [byte3, setByte3] = useState('');
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

    useEffect(() => {
        if (byte1Valid && byte2Valid && byte3Valid) {
            setByte1Disabled(false);
            setByte2Disabled(byte1 === '192');
            setByte3Disabled(false);
        } else {
            setByte1Disabled(byte1Valid);
            setByte2Disabled(byte2Valid);
            setByte3Disabled(byte3Valid);
        }
    }, [byte1Valid, byte2Valid, byte3Valid]);

    useEffect(() => {
        setByte1Valid(true);
        setByte2Valid(true);
        setByte3Valid(true);
        setValidationMessage('');
    }, [byte1, byte2, byte3]);

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