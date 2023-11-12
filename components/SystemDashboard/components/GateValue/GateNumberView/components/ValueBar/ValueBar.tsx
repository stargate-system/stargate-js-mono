import {
    Dispatch,
    SetStateAction,
    useCallback, useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import styles from './ValueBar.module.css';
import {GateNumber} from "gate-core";

interface ValueBarProps {
    gateNumber: GateNumber
    min: number,
    max: number,
    value: number,
    setValue: Dispatch<SetStateAction<number>>,
    isActive: boolean,
    editable: boolean
}

const ValueBar = (props: ValueBarProps) => {
    const {
        gateNumber,
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
            return factor * offsetValue + dragInitialValue.current;
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

    const barOnClick = (ev: any) => {
        ev.preventDefault();
        // @ts-ignore
        console.log('>>>', valueBarRef.current?.offsetWidth, ev.nativeEvent.offsetX);
    }

    const onDragStart = (ev: any) => {
        ev.dataTransfer.setDragImage(new Image(), 0, 0)
        setDragStart(ev.clientX);
        dragInitialValue.current = value;
    }

    const onDragEnd = () => {
        setDragStart(undefined);
    }

    const sliderOnDrag = (ev: any) => {
        ev.preventDefault();
        if((!ev.screenX && !ev.screenY) || !dragStart) return;
        gateNumber.setValue(calcSliderValue(ev.clientX - dragStart));
        // @ts-ignore
        setValue(gateNumber.value);
        // @ts-ignore
        setSliderPosition(calcSliderPosition(calcPercent(gateNumber.value)));
    }

    useEffect(() => {
        if (editable && dragStart === undefined) {
            setSliderPosition(calcSliderPosition(percent));
        }
    }, [value]);

    return (
        <div className={styles.valueBarContainer}>
            <div ref={valueBarRef} onClick={barOnClick} className={styles.bar} style={backgroundImage}/>
            {editable && <div draggable={true} onDrag={sliderOnDrag} onDragStart={onDragStart} onDragEnd={onDragEnd} className={styles.slider} style={{left: sliderPosition}} />}
        </div>
    )
}

export default ValueBar;
