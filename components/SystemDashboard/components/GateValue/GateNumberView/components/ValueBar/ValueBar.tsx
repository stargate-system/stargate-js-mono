import {
    useCallback, useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import styles from './ValueBar.module.css';

interface ValueBarProps {
    min: number,
    max: number,
    value: number,
    setValue: Function,
    isActive: boolean,
    editable: boolean
}

const ValueBar = (props: ValueBarProps) => {
    const {
        min = 0,
        max,
        value,
        setValue,
        isActive,
        editable
    } = props;

    const [sliderPosition, setSliderPosition] = useState(0);
    const [dragStart, setDragStart] = useState<number>();
    const valueBarRef = useRef(null);
    const dragInitialValue = useRef(min);

    const calcPercent = (value: number) => {
        const fullRange = max - min;
        return (100 * (value - min)) / fullRange;
    }

    const percent = useMemo(() => {
        return calcPercent(value);
    }, [min, max, value]);

    const backgroundImage = useMemo(() => {
        return {backgroundImage: `linear-gradient(to right,
             ${isActive ? 'var(--value-bar-color-enabled)' : 'var(--value-bar-color-disabled)'} ${percent}%,
              #aaa ${percent}%)`}
    }, [isActive, percent]);

    const calcSliderValue = useCallback((offsetValue: number) => {
        // @ts-ignore
        const fullRange = valueBarRef.current?.offsetWidth;
        if (fullRange) {
            const factor = (max - min) / fullRange;
            return Math.round(100 * (factor * offsetValue + dragInitialValue.current)) / 100;
        }
    }, [min, max]);

    const calcSliderPosition = (percent: number) => {
        // @ts-ignore
        const fullWidth = valueBarRef.current?.offsetWidth
        if (fullWidth) {
            return Math.round((fullWidth * percent) / 100);
        }
        return 0;
    }

    const barPrecision = useMemo(() => {
        const fullRange = Math.abs(max - min);
        const baseDecimalCount = 2;
        if (fullRange === 1) {
            return baseDecimalCount;
        } else if (fullRange > 1) {
            const integerCount = Number.parseInt(fullRange.toString()).toString().length;
            const desiredDecimals = baseDecimalCount - integerCount + 1;
            return desiredDecimals > 0 ? desiredDecimals : 0;
        } else if (fullRange < 1) {
            const decimalCount = fullRange.toString().length - 2;
            return baseDecimalCount + decimalCount;
        }
    }, [min, max]);

    const barOnClick = (ev: any) => {
        if (isActive && editable) {
            // @ts-ignore
            const fullRange = valueBarRef.current?.offsetWidth;
            if (fullRange) {
                const factor = (max - min) / fullRange;
                const newValue = (factor * ev.nativeEvent.offsetX) + min;
                setValue(Number.parseFloat(newValue.toFixed(barPrecision).toString()));
            }
        }
    }

    const onDragStart = (ev: any) => {
        ev.dataTransfer.setDragImage(new Image(), 0, 0)
        if (isActive) {
            setDragStart(ev.clientX);
            dragInitialValue.current = value;
        }
    }

    const onDragEnd = () => {
        setDragStart(undefined);
    }

    const sliderOnDrag = (ev: any) => {
        if (isActive) {
            if ((!ev.screenX && !ev.screenY) || !dragStart) return;
            const newValue = calcSliderValue(ev.clientX - dragStart);
            if (newValue) {
                setValue(Number.parseFloat(newValue.toFixed(barPrecision).toString()));
            }
            // @ts-ignore
            setSliderPosition(calcSliderPosition(calcPercent(value)));
        }
    }

    useEffect(() => {
        if (editable && dragStart === undefined) {
            setSliderPosition(calcSliderPosition(percent));
        }
    }, [value]);

    return (
        <div className={styles.valueBarContainer}>
            <div
                ref={valueBarRef}
                onClick={barOnClick}
                className={styles.bar}
                style={backgroundImage}
            />
            {editable &&
                <div
                    draggable={true}
                    onDrag={sliderOnDrag}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    className={`${styles.slider} ${isActive ? styles.sliderEnabled : styles.sliderDisabled}`}
                    style={{left: sliderPosition}}
                />
            }
        </div>
    )
}

export default ValueBar;
