import styles from './Spinner.module.css';

interface SpinnerProps {
    className?: string
}

const Spinner = (props: SpinnerProps) => {
    const {className} = props;

    return (
        <div className={className}>
            <div className={styles.spinner}/>
        </div>
    );
}

export default Spinner;
