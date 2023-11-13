import {Directions, GateNumber, ValueTypes} from "gate-core";
import {CSSProperties, Dispatch, SetStateAction, useEffect, useState} from "react";
import styles from './GateNumberView.module.css'
import {GateValueView} from "../GateValueWrapper";
import ValueBar from "./components/ValueBar/ValueBar";
import ValueDisplay from "./components/ValueDisplay/ValueDisplay";

interface GateNumberViewProps extends GateValueView{
    gateValue: GateNumber,
    value: number,
    setValue: Dispatch<SetStateAction<number>>
    isActive: boolean
}

const valueSize = 1.2;

const GateNumberView = (props: GateValueView) => {
    const {gateValue, value, setValue, isActive} = props as GateNumberViewProps;

    const [isLimited, setIsLimited] = useState(false);
    const [editable, setEditable] = useState(false);
    const [rangePanelStyle, setRangePanelStyle] = useState<CSSProperties>();
    const [valuePanelStyle, setValuePanelStyle] = useState<CSSProperties>();

    const setLimitedValueDisplayStyles = () => {
        const rangeSize = 0.7;
        const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('font-family');
        const rem = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('font-size'));
        const context = document.createElement('canvas').getContext('2d');
        // @ts-ignore
        context.font = valueSize*rem + 'px ' + fontFamily;
        // @ts-ignore
        const metricsMin = context.measureText(gateValue.range[0]);
        // @ts-ignore
        const metricsMax = context.measureText(gateValue.range[1]);
        let maxValueWidth;
        let maxRangeWidth;
        // @ts-ignore
        context.font = rangeSize*rem + 'px ' + fontFamily;
        if (metricsMax.width > metricsMin.width) {
            maxValueWidth = metricsMax.width;
            // @ts-ignore
            maxRangeWidth = context.measureText(gateValue.range[1]).width;
        } else {
            maxValueWidth = metricsMin.width;
            // @ts-ignore
            maxRangeWidth = context.measureText(gateValue.range[0]).width;
        }
        let valuePanelSize = maxValueWidth + 0.8*rem;
        if (gateValue.type === ValueTypes.float) {
            valuePanelSize += 3*rem;
        }
        const rangePanelSize = gateValue.direction === Directions.input ? maxRangeWidth + 0.3*rem : maxRangeWidth;
        setValuePanelStyle({width: `${valuePanelSize}px`, fontSize: `${valueSize}rem`});
        setRangePanelStyle({width: `${rangePanelSize}px`, fontSize: `${rangeSize}rem`});
    }

    useEffect(() => {
        if (gateValue) {
            if (typeof gateValue.range[0] === "number" &&
                typeof gateValue.range[1] === "number") {
                setIsLimited(true);

                setLimitedValueDisplayStyles();
            } else {
                setRangePanelStyle(undefined);
                setValuePanelStyle({width: '7rem', fontSize: `${valueSize}rem`})
            }
            if (gateValue.direction === Directions.input) {
                setEditable(true);
            }
        }
    }, [gateValue]);

    return (
        <div className={styles.numberOutputContainer}>
            {isLimited &&
                <ValueBar
                    gateNumber={gateValue}
                    min={gateValue.range[0] ?? 0}
                    max={gateValue.range[1] ?? 1}
                    value={value}
                    setValue={setValue}
                    isActive={isActive}
                    editable={editable}
                />
            }
            <div className={styles.valueContainer}>
                {rangePanelStyle &&
                    <div className={styles.range} style={rangePanelStyle}>
                        {gateValue.range[0]}
                    </div>
                }
                <ValueDisplay
                    gateValue={gateValue}
                    value={value}
                    setValue={setValue}
                    isActive={isActive}
                    editable={editable}
                    style={valuePanelStyle}
                />
                {rangePanelStyle &&
                    <div className={`${styles.range} ${styles.right}`} style={rangePanelStyle}>
                        {gateValue.range[1]}
                    </div>
                }
            </div>
        </div>
    )
}

export default GateNumberView;
