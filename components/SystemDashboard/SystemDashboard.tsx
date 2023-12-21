import React from "react";
import DevicesDashboard from "./components/DevicesDashboard/DevicesDashboard";
import styles from './SystemDashboard.module.css';
import {SystemModel} from "gate-viewmodel";
import ReactGateViewModel from "../ReactGateViewModel/ReactGateViewModel";

interface SystemDashboardProps {
    systemModel: SystemModel
}

const SystemDashboard = (props: SystemDashboardProps) => {
    const {systemModel} = props;

    return (
        <div className={styles.systemDashboard}>
                <ReactGateViewModel systemModel={systemModel}>
                    <DevicesDashboard/>
                </ReactGateViewModel>
        </div>
    )
}

export default SystemDashboard;
