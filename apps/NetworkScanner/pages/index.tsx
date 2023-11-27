import ScannerPage from "@/pages/ScannerPage/ScannerPage";
import {useState} from "react";
import DevicesPage from "@/pages/DevicesPage/DevicesPage";

const Home = () => {
    const [scanSuccess, setScanSuccess] = useState(false);

    return (
        <div>
            {scanSuccess ? <DevicesPage setScanSuccess={setScanSuccess}/> : <ScannerPage setScanSuccess={setScanSuccess}/>}
        </div>
    );
}

export default Home;