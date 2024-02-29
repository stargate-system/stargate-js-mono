import styles from './GateButton.module.css';
import {CSSProperties, PropsWithChildren, useEffect, useRef, useState} from "react";

interface GateButtonProps extends PropsWithChildren{
    onClick?: () => void,
    onMouseDown?: () => void,
    onMouseUp?: () => void,
    disabled?: boolean,
    className?: string,
    style?: CSSProperties
}

const GateButton = (props: GateButtonProps) => {
    const {
        onClick,
        onMouseDown,
        onMouseUp,
        className,
        style,
        disabled,
        children
    } = props;

    const [isDown, setIsDown] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const onButtonDown = (ev: any) => {
        ev.preventDefault();
        setIsDown(true);
        if (onMouseDown) {
            onMouseDown();
        }
        if (onClick) {
            onClick();
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
            onMouseDown={onButtonDown}
            onMouseUp={onButtonUp}
            disabled={disabled}
            onMouseLeave={onMouseLeave}
            onTouchEnd={onButtonUp}
        >
            {children}
        </button>
    )
}

export default GateButton;
