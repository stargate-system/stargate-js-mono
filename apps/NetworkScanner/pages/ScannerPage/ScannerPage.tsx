import styles from './ScanerPage.module.css';
import IpInput from "@/pages/ScannerPage/components/IpInput/IpInput";
import StartButton from "@/pages/ScannerPage/components/StartButton/StartButton";
import {Dispatch, SetStateAction, useState} from "react";
import scanService, {scanResult} from "@/service/scanService";
import scanConfig from "@/service/scanConfig";
import DetectedList from "@/pages/ScannerPage/components/DetectedList/DetectedList";

interface ScannerPageProps {
    setScanSuccess: Dispatch<SetStateAction<boolean>>
}

const ScannerPage = (props: ScannerPageProps) => {
    const {setScanSuccess} = props;

    const [byte1, setByte1] = useState('192');
    const [byte2, setByte2] = useState('168');
    const [byte3, setByte3] = useState('');
    const [ipValid, setIpValid] = useState(true);
    const [scanInProgress, setScanInProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [scanMessage, setScanMessage] = useState('');
    const [detectedNetworks, setDetectedNetworks] = useState<Array<string>>([]);
    const [detectedDevices, setDetectedDevices] = useState<Array<string>>([]);

    const onNetworkDetected = (ipPattern: string) => {
        if (detectedNetworks.length <= scanConfig.maxNetworks) {
            detectedNetworks.push(ipPattern);
            setDetectedNetworks([...detectedNetworks]);
        } else {
            scanService.finishScan(scanResult.FAILED_NETWORKS);
        }
    }

    const onDeviceDetected = (ip: string) => {
        detectedDevices.push(ip);
        setDetectedDevices([...detectedDevices]);
    }

    const onScanFinished = (result: scanResult) => {
        setScanInProgress(false);
        setDetectedNetworks([]);
        setDetectedDevices([]);
        switch (result) {
            case scanResult.SUCCESS:
                setScanMessage('');
                setScanSuccess(true);
                break;
            case scanResult.FAILED_NETWORKS:
                setScanMessage('Scanner was unable to automatically select networks to scan. Please check if given IP range is correct or provide 3rd number to narrow down scan range');
                break;
            case scanResult.FAILED_DEVICES:
                setScanMessage('Scanner was unable to find any devices. Please check if given IP range is correct and devices are ready to accept connection');
                break;
            case scanResult.FAILED_TIMEOUT:
                setScanMessage('Scanner timed out. Please check if given IP range is correct and devices are ready to accept connection');
                break;
            case scanResult.ABORTED:
                setScanMessage('');
                break;
        }
    }

    const onStartButtonClick = () => {
        if (scanInProgress) {
            scanService.finishScan(scanResult.ABORTED);
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
            <p className={styles.scanMessage}>{scanMessage}</p>
            {!!detectedNetworks.length && <DetectedList label="Detected networks:" content={detectedNetworks}/>}
            {!!detectedDevices.length && <DetectedList label="Detected devices:" content={detectedDevices}/>}
        </div>
    )
}

export default ScannerPage;
