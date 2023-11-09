import ScannerPage from "@/pages/ScannerPage/ScannerPage";
import {useState} from "react";
import DevicesPage from "@/pages/DevicesPage/DevicesPage";
import AppWrapper from "../../../components/AppWrapper/AppWrapper";

const Home = () => {
    const [scanSuccess, setScanSuccess] = useState(false);

    return (
        <AppWrapper>
            {scanSuccess ? <DevicesPage setScanSuccess={setScanSuccess}/> : <ScannerPage setScanSuccess={setScanSuccess}/>}
        </AppWrapper>
    );
}

export default Home;