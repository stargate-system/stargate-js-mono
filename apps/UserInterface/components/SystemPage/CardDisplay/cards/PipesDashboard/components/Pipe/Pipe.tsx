import PipeValue, {PipeDashboardValue} from "./components/PipeValue";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import styles from './Pipe.module.css';
import {PipeModel} from "@stargate-system/model";

export interface PipeViewModel {
    centralValue: PipeDashboardValue,
    inputs?: PipeDashboardValue[],
    outputs?: PipeDashboardValue[]
}

interface PipeProps {
    model: PipeViewModel,
    selectedPipes: PipeModel[],
    setSelectedValue: (id: string, selected: boolean) => void
}

const Pipe = (props: PipeProps) => {
    const {
        model,
        selectedPipes,
        setSelectedValue
    } = props;

    const getPipeValueKey = (value: PipeDashboardValue) => {
        return model.centralValue.valueId + value.valueId;
    }

    return (
        <div className={styles.pipeContainer}>
            {model.inputs &&
                <div className={styles.valueContainer}>
                    <div className={styles.valueList}>
                        {model.inputs.map((input) =>
                            <PipeValue
                                key={getPipeValueKey(input)}
                                value={input}
                                selectedPipes={selectedPipes}
                                setSelectedValue={setSelectedValue}
                            />
                        )}
                    </div>
                    <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowDown}/>
                </div>
            }
            <PipeValue value={model.centralValue} selectedPipes={selectedPipes} setSelectedValue={setSelectedValue}/>
            {model.outputs &&
                <div className={styles.valueContainer}>
                    <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowDown}/>
                    <div className={styles.valueList}>
                        {model.outputs.map((output) =>
                            <PipeValue
                                key={getPipeValueKey(output)}
                                value={output}
                                selectedPipes={selectedPipes}
                                setSelectedValue={setSelectedValue}
                            />
                        )}
                    </div>
                </div>
            }
        </div>
    )
}

export default Pipe;
