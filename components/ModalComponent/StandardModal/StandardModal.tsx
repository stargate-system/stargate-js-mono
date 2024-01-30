import {PropsWithChildren, useContext} from "react";
import ModalContext from "local-frontend/service/ModalContext";
import styles from './StandardModal.module.css';

interface StandardModalProps extends PropsWithChildren{
    header?: string,
    onApprove?: () => void,
    approveDisabled?: boolean,
    approveVisible?: boolean,
    approveLabel?: string,
    onDeny?: () => void,
    denyLabel?: string
}

const StandardModal = (props: StandardModalProps) => {
    const {
        header,
        children,
        onApprove,
        approveDisabled,
        approveVisible = true,
        approveLabel = 'Yes',
        onDeny,
        denyLabel = 'Cancel'
    } = props;
    const modal = useContext(ModalContext);

    return (
        <div className={styles.standardModalContainer}>
            {header && <div className={styles.headerContainer}>{header}</div>}
            <div className={styles.childrenContainer}>
                {children}
            </div>
            <div className={styles.buttonsContainer}>
                {approveVisible &&
                    <button
                        onClick={() => {
                            if (onApprove) {
                                onApprove();
                            }
                            // @ts-ignore
                            modal.closeModal();
                        }}
                        disabled={approveDisabled ?? false}
                        className={styles.button}
                    >
                        {approveLabel}
                    </button>
                }
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
                    {denyLabel}
                </button>
            </div>
        </div>
    )
}

export default StandardModal;
