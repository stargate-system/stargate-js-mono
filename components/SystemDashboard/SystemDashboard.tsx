import React, {ReactElement, useEffect, useMemo, useState} from "react";
import DevicesDashboard from "./components/DevicesDashboard/DevicesDashboard";
import styles from './SystemDashboard.module.css';
import SystemHeader from "./components/SystemHeader/SystemHeader";
import {SystemModel} from "gate-viewmodel";
import ReactGateViewModel from "../ReactGateViewModel/ReactGateViewModel";
import LocalServerConnector from "../../apps/LocalFrontend/service/LocalServerConnector";
import {ConnectionState} from "gate-core";
import ModalComponent from "../ModalComponent/ModalComponent";
import Spinner from "../Spinner/Spinner";
import ModalContext, {ModalInterface} from "./ModalContext";

interface SystemDashboardProps {
    systemModel: SystemModel,
    headerContent: ReactElement
}

const SystemDashboard = (props: SystemDashboardProps) => {
    const {systemModel, headerContent} = props;

    const [connectionReady, setConnectionReady] = useState(false);
    const [modalContent, setModalContent] = useState<ReactElement | undefined>();
    const [modalVisible, setModalVisible] = useState(false);

    const modal: ModalInterface = useMemo(() => {
        return {
            openModal: (content: ReactElement) => {
                setModalContent(content);
                setModalVisible(true);
            },
            closeModal: () => {
                setModalContent(undefined);
                setModalVisible(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!connectionReady) {
            modal.closeModal();
        }
    }, [connectionReady]);

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
                <div className={styles.connectionModal}>
                    <Spinner className={styles.connectionSpinner}/>
                    Waiting for connection...
                </div>
            </ModalComponent>
            <ModalContext.Provider value={modal}>
                <ModalComponent open={modalVisible}>
                    {modalContent}
                </ModalComponent>
                <SystemHeader content={headerContent}/>
                <ReactGateViewModel systemModel={systemModel}>
                    <DevicesDashboard/>
                </ReactGateViewModel>
            </ModalContext.Provider>
        </div>
    )
}

export default SystemDashboard;
