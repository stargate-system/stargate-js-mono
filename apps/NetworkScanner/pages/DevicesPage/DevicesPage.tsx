import SystemDashboard from "../../../../components/SystemDashboard/SystemDashboard";
import {Dispatch, SetStateAction} from "react";
import scanService from "@/service/scanService/scanService";
import DirectSystemConnector from "@/service/connectors/DirectSystemConnector";
import {SystemModel} from "gate-viewmodel";

interface DevicesPageProps {
    setScanSuccess: Dispatch<SetStateAction<boolean>>
}

const DevicesPage = (props: DevicesPageProps) => {
    const {setScanSuccess} = props;

    const backToScanner = () => {
        scanService.resetScan();
        DirectSystemConnector.routerConnector.onDisconnect();
        setScanSuccess(false);
    }

    const HeaderContent = () => {
        return <div>
            <button onClick={backToScanner}>Back to scanner</button>
        </div>
    };

    return (
        <div>
            <SystemDashboard systemModel={new SystemModel(DirectSystemConnector.systemConnector)} headerContent={<HeaderContent/>}/>
        </div>
    );
}

export default DevicesPage;
