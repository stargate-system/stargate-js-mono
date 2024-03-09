import React, {PropsWithChildren, useCallback, useEffect, useRef} from "react";
import styles from './ModalComponent.module.css';

interface ModalComponentProps extends PropsWithChildren {
    open: boolean
}

const ModalComponent = (props: ModalComponentProps) => {
    const {open, children} = props;
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const closeListener = useCallback(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    useEffect(() => {
        if (dialogRef.current) {
            if (open) {
                dialogRef.current.showModal();
                dialogRef.current.addEventListener('close', closeListener);
            } else {
                dialogRef.current.removeEventListener('close', closeListener);
                dialogRef.current.close();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <dialog ref={dialogRef} className={styles.modal}>
            <div className={styles.childrenContainer}>
                {children}
            </div>
        </dialog>
    )
}

export default ModalComponent;
