import {ReactElement, useContext} from "react";
import ModalContext from "local-frontend/service/ModalContext";
import styles from './StandardModal.module.css';

interface StandardModalProps {
    body: ReactElement | string,
    onApprove: () => void,
    onDeny?: () => void,
    approveLabel?: string
}

const StandardModal = (props: StandardModalProps) => {
    const {body, onApprove, onDeny, approveLabel = 'Yes'} = props;
    const modal = useContext(ModalContext);

    return (
        <div className={styles.standardModalContainer}>
            {body}
            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => {
                        onApprove();
                        // @ts-ignore
                        modal.closeModal();
                    }}
                    className={styles.button}
                >
                    {approveLabel}
                </button>
                <button
                    onClick={() => {
                        if (onDeny) {
                            onDeny();
                        }
                        // @ts-ignore
                        modal.closeModal();
                    }}
                    className={styles.button}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default StandardModal;
