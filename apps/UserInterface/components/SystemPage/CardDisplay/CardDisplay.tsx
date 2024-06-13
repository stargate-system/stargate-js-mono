import styles from './CardDisplay.module.css';
import DevicesDashboard from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DevicesDashboard";
import {faGears, faLink} from "@fortawesome/free-solid-svg-icons";
import {useMemo, useState} from "react";
import PipesDashboard from "@/components/SystemPage/CardDisplay/cards/PipesDashboard/PipesDashboard";
import CardSelect from "@/components/SystemPage/CardDisplay/components/CardSelect/CardSelect";
import AccountOptions
    from "@/components/SystemPage/CardDisplay/components/AccountOptions/AccountOptions";
import CustomCard from "@/components/custom/CustomCard/CustomCard";

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
    },
    customCard: {
        id: 'customCard',
        label: 'Custom Card'
    }
}

const CardDisplay = () => {
    const [currentCard, setCurrentCard] = useState(Object.values(cards)[0].id);

    const card = useMemo(() => {
        switch (currentCard) {
            case cards.devices.id:
                return <DevicesDashboard/>
            case cards.pipes.id:
                return <PipesDashboard/>
            case cards.customCard.id:
                return <CustomCard/>
        }
    }, [currentCard]);

    return (
        <div className={styles.displayContainer}>
            <CardSelect currentCard={currentCard} setCurrentCard={setCurrentCard} className={styles.leftHeader}/>
            <AccountOptions className={styles.rightHeader}/>
            <div className={styles.content}>
                {card}
            </div>
        </div>
    );
}

export default CardDisplay;
