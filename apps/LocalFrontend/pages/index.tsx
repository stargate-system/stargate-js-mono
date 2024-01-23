import React, {ReactElement, useEffect, useMemo, useState} from "react";
import SystemDashboard from "../../../components/SystemDashboard/SystemDashboard";
import CardsComponent from "../../../components/CardsComponent/CardsComponent";
import styles from "../styles/Home.module.css";
import {ConnectionState} from "gate-core";
import ModalComponent from "../../../components/ModalComponent/ModalComponent";
import Spinner from "../../../components/Spinner/Spinner";
import ModalContext, {ModalInterface} from "../service/ModalContext";
import PipesDashboard from "../../../components/PipesDashboard/PipesDashboard";
import {getSystemModel} from "gate-controller";

const model = getSystemModel();
const cardNames = {
    devices: "Devices",
    pipes: "Pipes"
}

const Home = () => {
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
                return <SystemDashboard systemModel={model}/>
            case cardNames.pipes:
                return <PipesDashboard systemModel={model}/>
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

export default Home;