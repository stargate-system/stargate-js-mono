import SystemDashboard from "../../../../components/SystemDashboard/SystemDashboard";
import {Dispatch, SetStateAction} from "react";
import scanService from "@/service/scanService";

interface DevicesPageProps {
    setScanSuccess: Dispatch<SetStateAction<boolean>>
}

const DevicesPage = (props: DevicesPageProps) => {
    const {setScanSuccess} = props;

    const backToScanner = () => {
        scanService.resetScan();
        setScanSuccess(false);
    }

    const HeaderContent = () => {
        return <div>
            <button onClick={backToScanner}>Back to scanner</button>
        </div>
    };

    return (
        <div>
            <SystemDashboard connector={scanService.getSystemConnector()} headerContent={<HeaderContent/>}/>
        </div>
    );
}

export default DevicesPage;
