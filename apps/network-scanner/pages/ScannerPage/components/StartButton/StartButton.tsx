import styles from './StartButton.module.css';
import {CSSProperties, MouseEventHandler, useEffect, useState} from "react";

interface StartButtonProps {
    onClick: MouseEventHandler,
    disabled: boolean,
    scanInProgress: boolean,
    progressValue: number
}

const StartButton = (props: StartButtonProps) => {
    const {
        onClick,
        disabled,
        scanInProgress,
        progressValue
    } = props;

    const [buttonStyle, setButtonStyle] = useState<CSSProperties>({});

    useEffect(() => {
        if (!scanInProgress) {
            setButtonStyle({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanInProgress]);

    useEffect(() => {
        if (scanInProgress) {
            setButtonStyle({
                backgroundImage: 'linear-gradient(to right, limegreen ' + (progressValue - 2) + '%, beige ' + (progressValue + 2) + '%)'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progressValue]);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={styles.startButton}
            style={buttonStyle}
        >
            {scanInProgress ? 'Abort' : 'Start scan'}
        </button>
    );
}

export default StartButton;