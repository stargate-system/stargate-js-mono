import React, {ReactElement, useContext, useEffect, useMemo, useState} from "react";
import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";
import ModalContext, {ModalInterface} from "./ModalContext";
import {ConnectionState} from "gate-core";
import ModalComponent from "@/components/common/modals/BaseModal/ModalComponent";
import styles from "./SystemPage.module.css";
import CardDisplay from "@/components/SystemPage/CardDisplay/CardDisplay";

const SystemPage = () => {
    const model = useContext(SystemModelContext);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectionReady]);

    useEffect(() => {
        setConnectionReady(model.state.value === ConnectionState.ready);
        const stateListenerKey = model.state.subscribe(() => {
            setConnectionReady(model.state.value === ConnectionState.ready);
        });

        return () => {
            model.state.unsubscribe(stateListenerKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <ModalComponent open={!connectionReady}>
                <div className={styles.connectionModal}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="./spinner.svg" alt="spinner" className={styles.connectionSpinner}/>
                    Waiting for connection...
                </div>
            </ModalComponent>
            <ModalContext.Provider value={modal}>
                <ModalComponent open={modalVisible}>
                    {modalContent}
                </ModalComponent>
                <CardDisplay/>
            </ModalContext.Provider>
        </div>
    );
}

export default SystemPage;
