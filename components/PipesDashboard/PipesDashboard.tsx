import styles from './PipesDashboard.module.css';
import {SystemModel} from "gate-viewmodel";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext} from "react";
import ModalContext from "local-frontend/service/ModalContext";
import NewPipeModal from "./components/NewPipeModal/NewPipeModal";

interface PipesDashboardProps {
    systemModel: SystemModel
}

const PipesDashboard = (props: PipesDashboardProps) => {
    const {systemModel} = props;
    const modal = useContext(ModalContext);

    const onAddPipe = () => {
        if (modal) {
            modal.openModal(<NewPipeModal systemModel={systemModel}/>);
        }
    }

    return (
        <div className={styles.pipesDashboard}>
            <button className={styles.addButton} onClick={onAddPipe}>
                <FontAwesomeIcon className={styles.addIcon} icon={faPlus}/>
            </button>
        </div>
    )
}

export default PipesDashboard;
