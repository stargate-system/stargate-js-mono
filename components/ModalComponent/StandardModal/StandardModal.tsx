import {PropsWithChildren, useContext} from "react";
import ModalContext from "local-frontend/service/ModalContext";
import styles from './StandardModal.module.css';

interface StandardModalProps extends PropsWithChildren{
    onApprove: () => void,
    approveDisabled?: boolean,
    onDeny?: () => void,
    approveLabel?: string
}

const StandardModal = (props: StandardModalProps) => {
    const {
        children,
        onApprove,
        approveDisabled,
        onDeny,
        approveLabel = 'Yes'
    } = props;
    const modal = useContext(ModalContext);

    return (
        <div className={styles.standardModalContainer}>
            {children}
            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => {
                        onApprove();
                        // @ts-ignore
                        modal.closeModal();
                    }}
                    disabled={approveDisabled ?? false}
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
