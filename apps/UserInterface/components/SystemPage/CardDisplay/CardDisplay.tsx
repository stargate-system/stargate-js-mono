import styles from './CardDisplay.module.css';
import DevicesDashboard from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DevicesDashboard";
import {faGears, faLink} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useMemo, useState} from "react";
import PipesDashboard from "@/components/SystemPage/CardDisplay/cards/PipesDashboard/PipesDashboard";
import CardSelect from "@/components/SystemPage/CardDisplay/components/CardSelect/CardSelect";
import AccountOptions, { remoteStates } from "@/components/SystemPage/CardDisplay/components/AccountOptions/AccountOptions";
import SystemModelContext from '@/components/ReactGateViewModel/SystemModelContext';

export const cards = {
    devices: {
        id: 'devices',
        label: 'Devices',
        icon: faGears
    },
    pipes: {
        id: 'pipes',
        label: 'Pipes',
        icon: faLink
    }
}

const CardDisplay = () => {
    const model = useContext(SystemModelContext);
    const [currentCard, setCurrentCard] = useState(Object.values(cards)[0].id);
    const [remoteState, setRemoteState] = useState<string | undefined>();

    const getAccountClass = () => {
        let stateClass;
        switch(remoteState) {
            case remoteStates.off:
                stateClass = styles.remoteOff;
                break;
            case remoteStates.init:
                stateClass = styles.remoteInit;
                break;
            case remoteStates.on:
                stateClass = styles.remoteOn;
                break;
            case remoteStates.registered:
                stateClass = styles.remoteRegistered;
                break;
            case remoteStates.error:
                stateClass = styles.remoteError;
                break;
        }
        return `${styles.rightHeader} ${stateClass}`;
    }

    const card = useMemo(() => {
        switch (currentCard) {
            case cards.devices.id:
                return <DevicesDashboard/>
            case cards.pipes.id:
                return <PipesDashboard/>
        }
    }, [currentCard]);
    
    useEffect(() => {
        model.systemConnector?.connection.functionalHandler.addCommandListener('serverEvent', (params) => {
            if (params && params.length === 2 && params[0] === 'remoteAccess') {
                setRemoteState(params[1]);
            }
        });
        return () => model.systemConnector?.connection.functionalHandler.removeCommandListener('serverEvent');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.displayContainer}>
            <CardSelect currentCard={currentCard} setCurrentCard={setCurrentCard} className={styles.leftHeader}/>
            {remoteState &&
                <AccountOptions remoteState={remoteState} className={getAccountClass()}/>
            }
            <div className={styles.content}>
                {card}
            </div>
        </div>
    );
}

export default CardDisplay;
