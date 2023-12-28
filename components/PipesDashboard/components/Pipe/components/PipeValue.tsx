import styles from './PipeValue.module.css';

export interface PipeValueProps {
    deviceName: string,
    valueName: string,
    valueType: string
}

const PipeValue = (props: PipeValueProps) => {
    const {deviceName, valueName, valueType} = props;

    return (
        <div className={styles.pipeValueContainer}>
            <div className={styles.deviceNameContainer}>{deviceName}</div>
            <div className={styles.valueNameContainer}>{valueName}</div>
            <div className={styles.valueTypeContainer}>{valueType.toUpperCase()}</div>
        </div>
    )
}

export default PipeValue;
