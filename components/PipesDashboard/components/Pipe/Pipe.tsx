import PipeValue, {PipeValueProps} from "./components/PipeValue";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import styles from './Pipe.module.css';

export interface PipeProps {
    centralValue: PipeValueProps,
    inputs?: PipeValueProps[],
    outputs?: PipeValueProps[]
}

const Pipe = (props: PipeProps) => {
    const {centralValue, inputs, outputs} = props;

    return (
        <div className={styles.pipeContainer}>
            {inputs &&
                <div className={styles.valueContainer}>
                    <div className={styles.valueList}>
                        {inputs.map((input) => PipeValue(input))}
                    </div>
                    <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowDown}/>
                </div>
            }
            <PipeValue deviceName={centralValue.deviceName} valueName={centralValue.valueName}
                       valueType={centralValue.valueType}/>
            {outputs &&
                <div className={styles.valueContainer}>
                    <FontAwesomeIcon className={styles.arrowIcon} icon={faArrowDown}/>
                    <div className={styles.valueList}>
                        {outputs.map((output) => PipeValue(output))}
                    </div>
                </div>
            }
        </div>
    )
}

export default Pipe;
