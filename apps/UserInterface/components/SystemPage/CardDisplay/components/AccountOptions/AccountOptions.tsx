import styles from './AccountOptions.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import HeaderButton from "@/components/SystemPage/CardDisplay/components/HeaderButton/HeaderButton";
import {useContext, useEffect, useRef, useState} from "react";
import useClickOutsideDetector from "@/helper/useClickOutsideDetector";
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import {faKey, faPowerOff} from "@fortawesome/free-solid-svg-icons";
import SystemModelContext from '@/components/ReactGateViewModel/SystemModelContext';
import ModalContext from '@/components/SystemPage/ModalContext';
import CredentialsModal from './components/CredentialsModal';

export const remoteStates = {
    on: 'on',
    off: 'off',
    init: 'init',
    registered: 'ready',
    error: 'error'
}

interface AccountOptionsProps {
    remoteState: string,
    className?: string
}

const AccountOptions = (props: AccountOptionsProps) => {
    const model = useContext(SystemModelContext);
    const modal = useContext(ModalContext);
    const {remoteState, className} = props;
    const [menuOpen, setMenuOpen] = useState(false);
    const accountOptionsRef = useRef(null);
    useClickOutsideDetector(accountOptionsRef, () => setMenuOpen(false));
    const menuOpenRef = useRef(false);

    const options = [
        {
            id: 'credentials',
            label: 'Set credentials',
            icon: faKey
        },
        {
            id: 'switch',
            label: `Switch ${remoteState === remoteStates.off ? 'on' : 'off'}`,
            icon: faPowerOff
        }
    ]

    const getHeaderText = () => {
        switch(remoteState) {
            case remoteStates.off:
                return 'Remote access off';
            case remoteStates.init:
                return 'Connecting...';
            case remoteStates.on:
                return 'Registering...';
            case remoteStates.registered:
                return 'Remote access ready';
            case remoteStates.error:
                return 'Credentials incorrect';
        }
    }

    const getHeader = () => {
        return (
            <div className={styles.menuHeader}>
                {getHeaderText()}
            </div>
        )
    }

    const onSetCredentials = () => {
        modal?.openModal(<CredentialsModal onClose={() => setMenuOpen(true)}/>);
    }

    const onSwitch = () => {
        model.systemConnector?.connection.functionalHandler.sendCommand('remoteAccess', [remoteState === remoteStates.off ? 'on' : 'off']);
    }

    const onItemSelect = (id: string) => {
        switch(id) {
            case options[0].id:
                onSetCredentials();
                break;
            case options[1].id:
                onSwitch();
                break;
        }
    }

    useEffect(() => {
        menuOpenRef.current = menuOpen;
    }, [menuOpen]);

    return (
        <div ref={accountOptionsRef} className={`${className ?? ''}`}>
            <HeaderButton onClick={() => setMenuOpen(!menuOpenRef.current)}>
                <FontAwesomeIcon icon={faUser} size="xl"/>
            </HeaderButton>
            {menuOpen &&
                <DropdownMenu items={options} onItemSelect={onItemSelect} header={getHeader()}/>
            }
        </div>
    );
}

export default AccountOptions;
