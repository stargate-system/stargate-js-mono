import StandardModal from "@/components/common/modals/StandardModal/StandardModal";
import { useContext, useState } from "react";
import styles from './CredentialsModal.module.css';
import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";

interface CredentialsModalProps {
    onClose: () => void
}

const CredentialsModal = (props: CredentialsModalProps) => {
    const {onClose} = props;
    const model = useContext(SystemModelContext);
    const [credentials, setCredentials] = useState('');
    const [credentialsValid, setCredentialsValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const onApprove = () => {
        const [key, pass] = extractCredentials(credentials);
        model.systemConnector?.connection.functionalHandler.sendCommand('remoteAccess', [key, pass]);
        onClose();
    }

    const onInput = (ev: any) => {
        const currentCredentials = ev.target.value;
        setCredentials(currentCredentials);
        validateCredentials(currentCredentials);
    }

    const validateCredentials = (value: string) => {
        if (value && value.length > 3) {
            const [key, pass] = extractCredentials(value);
            if (key && pass) {
                setCredentialsValid(true);
                setErrorMessage(undefined);
            } else {
                setCredentialsValid(false);
                setErrorMessage('Credentials malformed');
            }
        } else {
            setCredentialsValid(false);
            setErrorMessage(undefined);
        }
    }

    const extractCredentials = (value: string) => {
        return value.split(',').map((n) => n.trim());
    }

    return (
        <StandardModal
            onApprove={onApprove}
            onDeny={onClose}
            approveDisabled={!credentialsValid}
            header="Paste credentials below"
            approveLabel="Save"
        >
            <div className={styles.credentialsModalBodyContainer}>
                <textarea
                    rows={2}
                    cols={37}
                    onInput={onInput}
                    value={credentials}
                    className={`${styles.credentialsInput} ${errorMessage ? styles.borderError : styles.borderNormal}`}
                />
                {errorMessage &&
                    <div className={styles.errorMessage}>{errorMessage}</div>
                }
            </div>
        </StandardModal>
    )
}

export default CredentialsModal;
