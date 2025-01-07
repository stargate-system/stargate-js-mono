import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import { GateString } from "@stargate-system/core";
import { ModelValue } from "@stargate-system/model";
import { useEffect, useRef, useState } from "react";
import styles from './Camera.module.css';

interface CameraProps {
    input: ModelValue<string> | undefined,
    width: string | undefined,
    height: string | undefined
}

const Camera = (props: CameraProps) => {
    const {input, width, height} = props;
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
        } else {
            setImageAvailable(false);
        }
    }, [currentFrame]);

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
                <div>Waiting for camera...</div>
            }
        </div>
    )
}

export default Camera;
