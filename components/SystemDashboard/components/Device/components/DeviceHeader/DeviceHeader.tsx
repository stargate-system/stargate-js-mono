import styles from './DeviceHeader.module.css';

interface DeviceHeaderProps {
    name: string
}

const DeviceHeader = (props: DeviceHeaderProps) => {
    const {name} = props;

    return (
        <div className={styles.deviceHeader}>
            {name}
        </div>
    )
}

export default DeviceHeader;
