import styles from './AppWrapper.module.css'
import {PropsWithChildren} from "react";

const AppWrapper = (props: PropsWithChildren) => {
    const {children} = props;

    return (
        <div className={styles.globalStyles}>
            {children}
        </div>
    )
}

export default AppWrapper;
