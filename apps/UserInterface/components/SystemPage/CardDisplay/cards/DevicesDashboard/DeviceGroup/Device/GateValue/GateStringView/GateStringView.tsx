import {GateValueProps} from "../GateValueWrapper";
import {Directions, GateString} from "@stargate-system/core";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import {CSSProperties, useEffect, useRef, useState} from "react";
import styles from './GateStringView.module.css';
import { faRectangleList } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { localStorageHelper } from "@/helper/localStorageHelper";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";

const GateStringView = (props: GateValueProps) => {
    const {valueModel, isActive} = props;
    const gateValue = valueModel.gateValue as GateString;
    const value = useModelValue(valueModel.modelValue);

    const [editable, setEditable] = useState(false);
    const [displayValue, setDisplayValue] = useState(value.toString());
    const [stringStyle, setStringStyle] = useState<CSSProperties>({width: '10rem'});
    const [bufferActive, setBufferActive] = useState(false);
    const [bufferSize, setBufferSize] = useState(10);
    const [displayBufferSize, setDisplayBufferSize] = useState(bufferSize.toString());
    const [buffer, setBuffer] = useState<string[]>([]);
    const [autoscroll, setAutoscroll] = useState(true);
    const bufferRef = useRef<HTMLDivElement | null>(null);

    const onInput = (ev: any) => {
        setDisplayValue(ev.target.value);
    }

    const onKeyDown = (ev: any, setFunction: () => void, resetFunction: () => void) => {
        switch (ev.key) {
            case 'Enter':
                setFunction();
                break;
            case 'Escape':
                resetFunction();
                break;
        }
    }

    const onBufferClick = () => {
        const parameters = localStorageHelper.getParameters(valueModel.gateValue);
        parameters.bufferActive = !bufferActive;
        localStorageHelper.setParameters(valueModel.gateValue, parameters);
        setBufferActive(!bufferActive);
    }

    const generateBufferContent = () => {
        return buffer.map((message, index) => <div key={index} className={styles.entry}>{message}</div>);
    }

    const onSizeChange = (event: any) => {
        const input = event.target.value.trim();
        if (input.match(/^[0-9]*$/)) {
            setDisplayBufferSize(input);
        }
    }

    const onSizeBlur = () => {
        const inputValue = Number.parseInt(displayBufferSize);
        if (!Number.isNaN(inputValue)) {
            const parameters = localStorageHelper.getParameters(valueModel.gateValue);
            setBufferSize(inputValue);
            parameters.bufferSize = inputValue;
            localStorageHelper.setParameters(valueModel.gateValue, parameters);
            if (buffer.length > inputValue) {
                buffer.splice(0, buffer.length - inputValue);
            }
        } else {
            setDisplayBufferSize(bufferSize.toString());
        }
    }

    useEffect(() => {
        if (gateValue.direction === Directions.input) {
            setEditable(true);
        }
        setDisplayValue(value.toString());
        setStringStyle({width: `min(80vw, ${gateValue.minimumLength ? gateValue.minimumLength : 10}rem`});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueModel]);

    useEffect(() => {
        setDisplayValue(value);
        buffer.push(value);
        if (buffer.length > bufferSize) {
            buffer.shift();
        }
        setBuffer([...buffer]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    useEffect(() => {
        if (bufferRef.current && autoscroll) {
            bufferRef.current.scrollTop = bufferRef.current.scrollHeight;
        }
    }, [buffer, autoscroll]);

    useEffect(() => {
        const parameters = localStorageHelper.getParameters(valueModel.gateValue);
        setBufferActive(parameters.bufferActive ?? false);
        if (parameters.bufferSize !== undefined) {
            setBufferSize(parameters.bufferSize);
            setDisplayBufferSize(parameters.bufferSize.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.stringViewContainer}>
            {editable &&
                <input
                    type='text'
                    onInput={onInput}
                    disabled={!editable || !isActive}
                    value={displayValue}
                    className={`${styles.valueDisplay} ${styles.editable}`}
                    onKeyDown={(ev) => onKeyDown(ev, () => gateValue.setValue(displayValue, false), () => setDisplayValue(value.toString()))}
                    style={stringStyle}
                    onBlur={() => gateValue.setValue(displayValue)}
                />
            }
            {!editable &&
                <div
                    className={`${styles.valueDisplay} ${styles.readonly} ${isActive ? styles.active : styles.inactive}`}
                    style={stringStyle}
                >
                    {displayValue}
                </div>
            }
            <div className={styles.bottomContainer}>
                <div className={styles.iconContainer} onClick={onBufferClick}>
                    <FontAwesomeIcon icon={faRectangleList} className={bufferActive ? styles.iconActive : ''}/>
                </div>
                {bufferActive &&
                    <div className={styles.controlsContainer}>
                        <div className={styles.iconContainer} onClick={() => setAutoscroll(!autoscroll)}>
                            <FontAwesomeIcon className={autoscroll ? styles.iconActive : ''} icon={faAnglesDown} />
                        </div>
                        <div className={styles.inputContainer}>
                            <input
                                type="text" 
                                value={displayBufferSize} 
                                onInput={onSizeChange}
                                onBlur={onSizeBlur}
                                onKeyDown={(ev) => onKeyDown(ev, onSizeBlur, () => setDisplayBufferSize(bufferSize.toString()))}
                                className={styles.input}
                            />
                        </div>
                    </div>
                }
            </div>
            {bufferActive &&
                <div ref={bufferRef} className={styles.bufferArea}>{generateBufferContent()}</div>
            }
        </div>
    )
}

export default GateStringView;
