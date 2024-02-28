import styles from './GateButton.module.css';
import {CSSProperties, useEffect, useRef, useState} from "react";

interface GateButtonProps {
    label: string,
    onClick?: () => void,
    onMouseDown?: () => void,
    onMouseUp?: () => void,
    disabled?: boolean,
    className?: string,
    style?: CSSProperties
}

const GateButton = (props: GateButtonProps) => {
    const {label,
        onClick,
        onMouseDown,
        onMouseUp,
        className,
        style,
        disabled
    } = props;

    const [isDown, setIsDown] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const onButtonDown = (ev: any) => {
        ev.preventDefault();
        setIsDown(true);
        if (onMouseDown) {
            onMouseDown();
        }
    }

    const onButtonUp = () => {
        setIsDown(false);
        if (onMouseUp) {
            onMouseUp();
        }
    }

    const onMouseLeave = () => {
        if (isDown) {
            onButtonUp();
        }
    }

    const buttonClass = `
        ${styles.gateButton}
        ${disabled ? styles.buttonDisabled : styles.buttonEnabled}
        ${disabled ? '' : (isDown ? styles.buttonDown : styles.buttonUp)}
        ${className ?? ''}
    `;

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.addEventListener('touchstart', onButtonDown, {passive: false});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <button
            ref={buttonRef}
            className={buttonClass}
            style={style}
            onClick={onClick}
            onMouseDown={onButtonDown}
            onMouseUp={onButtonUp}
            disabled={disabled}
            onMouseLeave={onMouseLeave}
            onTouchEnd={onButtonUp}
        >
            {label}
        </button>
    )
}

export default GateButton;
