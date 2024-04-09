import styles from './AccountOptions.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import HeaderButton from "@/components/SystemPage/CardDisplay/components/HeaderButton/HeaderButton";

interface AccountOptionsProps {
    className?: string
}

const AccountOptions = (props: AccountOptionsProps) => {
    const {className} = props;

    return (
        <div className={`${styles.accountOptionsContainer} ${className ?? ''}`}>
            <HeaderButton onClick={() => {}}>
                <FontAwesomeIcon icon={faUser} size="xl"/>
            </HeaderButton>
        </div>
    );
}

export default AccountOptions;
