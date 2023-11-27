import React, {PropsWithChildren, useEffect, useRef} from "react";
import styles from './ModalComponent.module.css';

interface ModalComponentProps extends PropsWithChildren {
    open: boolean
}

const ModalComponent = (props: ModalComponentProps) => {
    const {open, children} = props;
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (open) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [open]);

    return (
        <dialog ref={dialogRef} className={styles.modal}>
            {children}
        </dialog>
    )
}

export default ModalComponent;
