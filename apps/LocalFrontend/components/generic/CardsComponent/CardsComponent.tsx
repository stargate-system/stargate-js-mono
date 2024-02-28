import {Dispatch, SetStateAction} from "react";
import styles from "./CardsComponent.module.css";

interface CardComponentProps {
    names: string[],
    activeName: string,
    setActiveName: Dispatch<SetStateAction<string>>
}

const CardsComponent = (props: CardComponentProps) => {
    const {names, activeName, setActiveName} = props;

    const generateCards = () => {
        return names.map((name, index) => {
            return (
                <div
                    key={name}
                    className={`${styles.card} ${activeName === name ? styles.cardActive : styles.cardInactive} ${index < names.length - 1 ? styles.withBorder : ''}`}
                    onClick={() => setActiveName(name)}
                >
                    {name}
                </div>
            )
        })
    }

    return (
        <div className={styles.cardsComponent}>
            {generateCards()}
        </div>
    )
}

export default CardsComponent;
