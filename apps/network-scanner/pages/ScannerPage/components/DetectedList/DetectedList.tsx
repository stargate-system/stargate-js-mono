import styles from './DetectedList.module.css';

interface DetectedListProps {
    label: string,
    content: Array<string>
}

const DetectedList = (props: DetectedListProps) => {
    const {label, content} = props;

    return (
        <div className={styles.listContainer}>
            <span className={styles.labelContainer}>{label}</span>
            <div className={styles.contentContainer}>
                {
                    content.map((value) => <span key={value}>{value}</span>)
                }
            </div>
        </div>
    );
}

export default DetectedList;
