import { GateNumber } from "@stargate-system/core";
import { GateValueModel } from "@stargate-system/model";
import { useMemo, useEffect, useState, FormEvent } from "react";
import styles from './NumberChart.module.css';
import NumberChartArea from "./components/NumberChartArea";
import { localStorageHelper } from "@/helper/localStorageHelper";

interface NumberChartProps {
    model: GateValueModel,
    isActive: boolean
}

const NumberChart = (props: NumberChartProps) => {
    const {model, isActive} = props;
    const gateNumber = model.gateValue as GateNumber;
    const [min, setMin] = useState(gateNumber.minimum ?? -10);
    const [displayMin, setDisplayMin] = useState(min.toString());
    const [max, setMax] = useState(gateNumber.maximum ?? 10);
    const [displayMax, setDisplayMax] = useState(max.toString());
    const [span, setSpan] = useState(10);
    const [displaySpan, setDisplaySpan] = useState(span.toString());

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

    const onMinChange = (event: any) => {
        const input = event.target.value.trim();
        if (input.match(/^-?[0-9]*\.?[0-9]*$/)) {
            setDisplayMin(input);
        }
    }

    const onMinBlur = () => {
        const inputValue = Number.parseFloat(displayMin);
        if (!Number.isNaN(inputValue)) {
            const parameters = localStorageHelper.getParameters(model.gateValue);
            if (inputValue < max) {
                setMin(inputValue);
                parameters.min = inputValue;
            } else {
                setMin(max - 1);
                setDisplayMin((max - 1).toString());
                parameters.min = max - 1;
            }
            localStorageHelper.setParameters(model.gateValue, parameters);
        } else {
            setDisplayMin(min.toString());
        }
    }

    const onMaxChange = (event: any) => {
        const input = event.target.value.trim();
        if (input.match(/^-?[0-9]*\.?[0-9]*$/)) {
            setDisplayMax(input);
        }
    }

    const onMaxBlur = () => {
        const inputValue = Number.parseFloat(displayMax);
        if (!Number.isNaN(inputValue)) {
            const parameters = localStorageHelper.getParameters(model.gateValue);
            if (inputValue > min) {
                setMax(inputValue);
                parameters.max = inputValue;
            } else {
                setMax(min + 1);
                setDisplayMax((min + 1).toString());
                parameters.max = min + 1;
            }
            localStorageHelper.setParameters(model.gateValue, parameters);
        } else {
            setDisplayMax(max.toString());
        }
    }

    const onSpanChange = (event: any) => {
        const input = event.target.value.trim();
        if (input.match(/^[0-9]*$/)) {
            setDisplaySpan(input);
        }
    }

    const onSpanBlur = () => {
        const inputValue = Number.parseInt(displaySpan);
        if (!Number.isNaN(inputValue)) {
            const parameters = localStorageHelper.getParameters(model.gateValue);
            if (inputValue > 0) {
                setSpan(inputValue);
                parameters.span = inputValue;
            } else {
                setSpan(1);
                setDisplaySpan((1).toString());
                parameters.span = 1;
            }
            localStorageHelper.setParameters(model.gateValue, parameters);
        } else {
            setDisplaySpan(span.toString());
        }
    }

    useEffect(() => {
        const parameters = localStorageHelper.getParameters(model.gateValue);
        if (parameters.min) {
            setMin(parameters.min);
            setDisplayMin(parameters.min.toString());
        }
        if (parameters.max) {
            setMax(parameters.max);
            setDisplayMax(parameters.max.toString());
        }
        if (parameters.span) {
            setSpan(parameters.span);
            setDisplaySpan(parameters.span.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.chartContainer}>
            <NumberChartArea min={min} max={max} span={span} model={model} isActive={isActive}/>
            <div className={styles.chartSettings}>
                <div className={styles.inputContainer}>
                    <div className={styles.label}>min</div>
                    <input
                        type="text" 
                        value={displayMin} 
                        onInput={onMinChange}
                        onBlur={onMinBlur}
                        onKeyDown={(ev) => onKeyDown(ev, onMinBlur, () => setDisplayMin(min.toString()))}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.label}>max</div>
                    <input
                        type="text" 
                        value={displayMax} 
                        onInput={onMaxChange}
                        onBlur={onMaxBlur}
                        onKeyDown={(ev) => onKeyDown(ev, onMaxBlur, () => setDisplayMax(max.toString()))}
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.label}>{'span (s)'}</div>
                    <input
                        type="text" 
                        value={displaySpan} 
                        onInput={onSpanChange}
                        onBlur={onSpanBlur}
                        onKeyDown={(ev) => onKeyDown(ev, onSpanBlur, () => setDisplaySpan(span.toString()))}
                        className={styles.input}
                    />
                </div>
            </div>
        </div>
    );
}

export default NumberChart;
