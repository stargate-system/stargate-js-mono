import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import { GateString } from "@stargate-system/core";
import { ModelValue } from "@stargate-system/model";
import { useEffect, useRef, useState } from "react";
import styles from './Camera.module.css';

interface CameraProps {
    input: ModelValue<string> | undefined,
    width: string | undefined,
    height: string | undefined,
    onFpsChange?: (fps: number) => void
}

const counter = {current: 0}

const Camera = (props: CameraProps) => {
    const {input, width, height, onFpsChange} = props;
    const currentFrame = useModelValue(input);

    const imageRef = useRef<HTMLImageElement>(null);
    const [imageAvailable, setImageAvailable] = useState(false);

    useEffect(() => {
        if (currentFrame && currentFrame.length > 0) {
            setImageAvailable(true);
            const frame = new Uint8Array(Buffer.from(currentFrame, 'base64'));
            if (imageRef.current) {
                const url = URL.createObjectURL(new Blob([frame], {type: "image/jpeg"}))
                imageRef.current.src = url;
            }
            counter.current += 1;
        } else {
            setImageAvailable(false);
        }
    }, [currentFrame]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (onFpsChange) {
                onFpsChange(counter.current);
            }
            counter.current = 0;
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.mainContainer}>
            {imageAvailable &&
                <img
                    ref={imageRef}
                    width={width}
                    height={height}
                    draggable="false"
                />
            }
            {!imageAvailable &&
                <div className={styles.waitingForCamera}>Waiting for camera...</div>
            }
        </div>
    )
}

export default Camera;
