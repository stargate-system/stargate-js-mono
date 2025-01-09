import { MutableRefObject, PropsWithChildren, useState } from "react";
import styles from './DivWithPointer.module.css';

interface DivWithPointerProps extends PropsWithChildren {
    onDoubleClick?: () => void,
    onPointerMove?: (x: number, y: number) => void,
    onPointerReleased?: () => void
    className?: string
}

const DivWithPointer = (props: DivWithPointerProps) => {
    const {onDoubleClick, onPointerMove, onPointerReleased, className, children} = props;
    const [isActive, setIsActive] = useState(false);
    const [lastMove, setLastMove] = useState([0, 0]);
    const [click, setClick] = useState(false);

    const getX = (ev: any) => {
        return ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
    }

    const getY = (ev: any) => {
        return ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;
    }

    const onPointerDown = (ev: any) => {
        if (!ev.changedTouches && !ev.screenX && !ev.screenY) return;
        if (click) {
            if (onDoubleClick) {
                onDoubleClick();
            }
        } else {
            setLastMove([getX(ev), getY(ev)]);
            setIsActive(true);
            setClick(true);
            setTimeout(() => setClick(false), 500);
        }
    }

    const onPointerUp = () => {
        setIsActive(false);
        if (onPointerReleased) {
            onPointerReleased();
        }
    }

    const onCameraMove = (ev: any) => {
        if (!isActive || (!ev.changedTouches && !ev.screenX && !ev.screenY)) return;
        if (onPointerMove) {
            onPointerMove(getX(ev) - lastMove[0], getY(ev) - lastMove[1]);
        }
        setLastMove([getX(ev), getY(ev)]);
    }

    return (
        <div
            className={styles.mainContainer + ' ' + className}
            draggable="false"
            onMouseDown={onPointerDown}
            onTouchStart={onPointerDown}
            onMouseUp={onPointerUp}
            onTouchEnd={onPointerUp}
            onMouseMove={onCameraMove}
            onTouchMove={onCameraMove}
            onMouseLeave={onPointerUp}
        >
            {children}
        </div>
    )
}

export default DivWithPointer;
