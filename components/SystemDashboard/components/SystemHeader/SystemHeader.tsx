// @ts-ignore
import React, {ReactElement} from "react";
import styles from './SystemHeader.module.css';

interface SystemHeaderProps {
    content: ReactElement
}

const SystemHeader = (props: SystemHeaderProps) => {
    const {content} = props;

    return (
        <div className={styles.systemHeader}>
            {content}
        </div>
    );
}

export default SystemHeader;
