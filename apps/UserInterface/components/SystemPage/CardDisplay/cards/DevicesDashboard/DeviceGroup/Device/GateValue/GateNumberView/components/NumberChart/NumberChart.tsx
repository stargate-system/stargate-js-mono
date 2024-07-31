import { GateNumber } from "@stargate-system/core";
import { GateValueModel } from "@stargate-system/model";
import { useMemo, useEffect, useState, FormEvent } from "react";
import styles from './NumberChart.module.css';
import NumberChartArea from "./components/NumberChartArea";

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
            if (inputValue < max) {
                setMin(inputValue);
            } else {
                setMin(max - 1);
                setDisplayMin((max - 1).toString());
            }
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
            if (inputValue > min) {
                setMax(inputValue);
            } else {
                setMax(min + 1);
                setDisplayMax((min + 1).toString());
            }
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
            if (inputValue > 0) {
                setSpan(inputValue);
            } else {
                setSpan(1);
                setDisplaySpan((1).toString());
            }
        } else {
            setDisplaySpan(span.toString());
        }
    }

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
