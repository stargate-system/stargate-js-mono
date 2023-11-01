import styles from './ScanerPage.module.css';
import IpInput from "@/pages/ScannerPage/components/IpInput/IpInput";
import StartButton from "@/pages/ScannerPage/components/StartButton/StartButton";
import {useState} from "react";
import scanService from "@/pages/ScannerPage/service/scanService";

const ScannerPage = () => {
    const [byte1, setByte1] = useState('192');
    const [byte2, setByte2] = useState('168');
    const [byte3, setByte3] = useState('');
    const [ipValid, setIpValid] = useState(true);
    const [scanInProgress, setScanInProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [scanMessage, setScanMessage] = useState('');

    const onNetworkDetected = (ipPattern: string) => {
        console.log('>>> Found ' + ipPattern);
    }

    const onDeviceDetected = (ip: string) => {

    }

    const onScanFinished = () => {
        setScanInProgress(false);
    }

    const onStartButtonClick = () => {
        if (scanInProgress) {
            scanService.abortScan();
        } else {
            setScanInProgress(true);
            scanService.startScan(
                byte1,
                byte2,
                byte3,
                onNetworkDetected,
                onDeviceDetected,
                onScanFinished,
                setScanMessage,
                setProgressValue
            );
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.startContainer}>
                <IpInput
                    byte1={byte1}
                    byte2={byte2}
                    byte3={byte3}
                    setByte1={setByte1}
                    setByte2={setByte2}
                    setByte3={setByte3}
                    setIpValid={setIpValid}
                    scanInProgress={scanInProgress}
                />
                <StartButton
                    disabled={!ipValid}
                    onClick={onStartButtonClick}
                    scanInProgress={scanInProgress}
                    progressValue={progressValue}
                />
            </div>
            <p hidden={!scanInProgress}>{scanMessage}</p>
        </div>
    )
}

export default ScannerPage;
