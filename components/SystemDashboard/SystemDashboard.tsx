import React, {ReactElement, useEffect, useState} from "react";
import DevicesDashboard from "./components/DevicesDashboard/DevicesDashboard";
import styles from './SystemDashboard.module.css';
import SystemHeader from "./components/SystemHeader/SystemHeader";
import {SystemModel} from "gate-viewmodel";
import ReactGateViewModel from "../ReactGateViewModel/ReactGateViewModel";
import LocalServerConnector from "../../apps/LocalFrontend/service/LocalServerConnector";
import {ConnectionState} from "gate-core";
import ModalComponent from "../ModalComponent/ModalComponent";

interface SystemDashboardProps {
    systemModel: SystemModel,
    headerContent: ReactElement
}

const SystemDashboard = (props: SystemDashboardProps) => {
    const {systemModel, headerContent} = props;

    const [connectionReady, setConnectionReady] = useState(false);

    useEffect(() => {
        const listenerKey = LocalServerConnector.addStateChangeListener((state) => {
            setConnectionReady(state === ConnectionState.ready);
        })
        return () => {
            LocalServerConnector.removeStateChangeListener(listenerKey);
        };
    }, []);

    return (
        <div className={styles.systemDashboard}>
            <ModalComponent open={!connectionReady}>
                <div className={styles.connectionModal} autoFocus={true}>Waiting for connection...</div>
            </ModalComponent>
            <SystemHeader content={headerContent}/>
            <ReactGateViewModel systemModel={systemModel}>
                <DevicesDashboard/>
            </ReactGateViewModel>
        </div>
    )
}

export default SystemDashboard;
