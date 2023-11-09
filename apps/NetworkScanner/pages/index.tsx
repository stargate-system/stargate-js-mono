import ScannerPage from "@/pages/ScannerPage/ScannerPage";
import globalStyles from '../../globalStyles.module.css';
import {useState} from "react";
import DevicesPage from "@/pages/DevicesPage/DevicesPage";

const Home = () => {
    const [scanSuccess, setScanSuccess] = useState(false);

    return (
        <div className={`${globalStyles.globalStyles} ${globalStyles.darkTheme}`}>
            {scanSuccess ? <DevicesPage setScanSuccess={setScanSuccess}/> : <ScannerPage setScanSuccess={setScanSuccess}/>}
        </div>
    );
}

export default Home;