import styles from './ScanerPage.module.css';
import IpInput from "@/pages/ScannerPage/components/IpInput/IpInput";
import StartButton from "@/pages/ScannerPage/components/StartButton/StartButton";

const ScannerPage = () => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.startContainer}>
                <IpInput/>
                <StartButton/>
            </div>
        </div>
    )
}

export default ScannerPage;
