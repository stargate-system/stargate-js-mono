import styles from './ProgressBar.module.css';
import {useMemo} from "react";

interface ProgressBarProps {
    percentFull?: number,
    isActive: boolean
}

const ProgressBar = (props: ProgressBarProps) => {
    const {percentFull, isActive} = props;

    const valueBarStyle = useMemo(() => {
        const percent = percentFull ?? 0;
        return {
            backgroundImage: `linear-gradient(to right,
         ${isActive ? 'var(--value-bar-color-enabled)' : 'var(--value-bar-color-disabled)'} ${percent}%,
          #aaa ${percent}%)`
        };
    }, [percentFull]);

    return <div className={styles.progressBar} style={valueBarStyle}></div>
}

export default ProgressBar;
