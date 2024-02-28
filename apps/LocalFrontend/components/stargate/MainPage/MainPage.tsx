import React, {ReactElement, useContext, useEffect, useMemo, useState} from "react";
import SystemModelContext from "@/components/stargate/ReactGateViewModel/SystemModelContext";
import ModalContext, {ModalInterface} from "@/components/stargate/MainPage/ModalContext";
import DevicesDashboard from "@/components/cards/DevicesDashboard/DevicesDashboard";
import PipesDashboard from "@/components/cards/PipesDashboard/PipesDashboard";
import {ConnectionState} from "gate-core";
import ModalComponent from "@/components/generic/ModalComponent/ModalComponent";
import styles from "./MainPage.module.css";
import Spinner from "@/components/generic/Spinner/Spinner";
import CardsComponent from "@/components/generic/CardsComponent/CardsComponent";

const cardNames = {
    devices: "Devices",
    pipes: "Pipes"
}

const MainPage = () => {
    const model = useContext(SystemModelContext);
    const [connectionReady, setConnectionReady] = useState(false);
    const [pipesAvailable, setPipesAvailable] = useState(false);
    const [modalContent, setModalContent] = useState<ReactElement | undefined>();
    const [modalVisible, setModalVisible] = useState(false);
    const [activeCard, setActiveCard] = useState(cardNames.devices);
    const [headerOffset, setHeaderOffset] = useState('0px');

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

    const displayActiveCard = () => {
        switch (activeCard) {
            case cardNames.devices:
                return <DevicesDashboard/>
            case cardNames.pipes:
                return <PipesDashboard/>
        }
    }

    useEffect(() => {
        if (!connectionReady) {
            modal.closeModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectionReady]);

    useEffect(() => {
        setHeaderOffset(pipesAvailable ? '2.5rem' : '0px');
    }, [pipesAvailable]);

    useEffect(() => {
        setConnectionReady(model.state.value === ConnectionState.ready);
        setPipesAvailable(model.devices.values.length > 1);
        const stateListenerKey = model.state.subscribe(() => {
            setConnectionReady(model.state.value === ConnectionState.ready);
        });

        const devicesListenerKey = model.devices.subscribe(() => {
            setPipesAvailable(model.devices.values.length > 1);
        });

        return () => {
            model.state.unsubscribe(stateListenerKey);
            model.devices.unsubscribe(devicesListenerKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
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
                {pipesAvailable &&
                    <div className={styles.appHeader}>
                        <CardsComponent
                            names={Object.values(cardNames)}
                            activeName={activeCard}
                            setActiveName={setActiveCard}
                        />
                    </div>
                }
                <div
                    className={styles.cardContent}
                    style={
                        {
                            minHeight: `calc(100vh - ${headerOffset})`,
                            paddingTop: headerOffset
                        }
                    }
                >
                    {displayActiveCard()}
                </div>
            </ModalContext.Provider>
        </div>
    );
}

export default MainPage;
