import React, {ReactElement} from "react";
import DevicesDashboard from "./components/DevicesDashboard/DevicesDashboard";
import styles from './SystemDashboard.module.css';
import SystemHeader from "./components/SystemHeader/SystemHeader";
import {SystemModel} from "gate-viewmodel";
import ReactGateViewModel from "../ReactGateViewModel/ReactGateViewModel";

interface SystemDashboardProps {
    systemModel: SystemModel,
    headerContent: ReactElement
}

const SystemDashboard = (props: SystemDashboardProps) => {
    const {systemModel, headerContent} = props;

    return (
        <div className={styles.systemDashboard}>
            <SystemHeader content={headerContent}/>
            <ReactGateViewModel systemModel={systemModel}>
                <DevicesDashboard/>
            </ReactGateViewModel>
        </div>
    )
}

export default SystemDashboard;
