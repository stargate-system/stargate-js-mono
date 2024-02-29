import GateButton from "@/components/generic/GateButton/GateButton";
import {PropsWithChildren} from "react";
import styles from './HeaderButton.module.css';

interface HeaderButtonProps extends PropsWithChildren {
    onClick: () => void,
    className?: string
}

const HeaderButton = (props: HeaderButtonProps) => {
    const {onClick, className, children} = props;
    return (
        <GateButton className={`${styles.headerButton} ${className ?? ''}`} onClick={onClick}>
            {children}
        </GateButton>
    );
}

export default HeaderButton;
