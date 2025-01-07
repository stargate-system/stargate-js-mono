import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";
import { DeviceModel, DeviceSubscription, GateValueModel, ModelValue } from "@stargate-system/model";
import { useRef, useContext, useState, useEffect } from "react";
import styles from './TrackedRobot.module.css';
import Camera from "../common/Camera/Camera";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import { GateString } from "@stargate-system/core";

 const baseCameraSensitivity = 1;

const TrackedRobot = () => {
    const systemModel = useContext(SystemModelContext);
    const [deviceModel, setDeviceModel] = useState<DeviceModel | undefined>();
    const [camera, setCamera] = useState<ModelValue<string> | undefined>();
    const [cameraX, setCameraX] = useState<GateValueModel | undefined>();
    const [cameraY, setCameraY] = useState<GateValueModel | undefined>();
    const [cameraWidth, setCameraWidth] = useState<string | undefined>();
    const [cameraHeight, setCameraHeight] = useState<string | undefined>();
    const cameraRef = useRef<HTMLDivElement | null>(null);
    const [cameraMoveActive, setCameraMoveActive] = useState(false);
    const [cameraLastMove, setCameraLastMove] = useState([0, 0]);
    const currentCameraX = useModelValue(cameraX?.modelValue as ModelValue<number>);
    const currentCameraY = useModelValue(cameraY?.modelValue as ModelValue<number>);
    const [cameraSensitivity, setCameraSensitivity] = useState(0.002);
    const [cameraClick, setCameraClick] = useState(false);
    const [keyEvents, setKeyEvents] = useState<GateString | undefined>();

    const setCameraSize = () => {
        if (cameraRef.current) {
            const ratio = cameraRef.current.offsetWidth / cameraRef.current.offsetHeight;
            if (ratio >= (4/3)) {
                setCameraHeight((cameraRef.current.clientHeight > 800 ? 800 : cameraRef.current.clientHeight).toString());
                setCameraWidth(undefined);
                setCameraSensitivity(baseCameraSensitivity / cameraRef.current.clientHeight);
            } else {
                setCameraWidth(cameraRef.current.clientWidth.toString());
                setCameraHeight(undefined);
                setCameraSensitivity(baseCameraSensitivity / cameraRef.current.clientWidth);
            }
        }
    }

    const getX = (ev: any) => {
        return ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
    }

    const getY = (ev: any) => {
        return ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;
    }

    const onCameraMouseDown = (ev: any) => {
        if (!ev.changedTouches && !ev.screenX && !ev.screenY) return;
        if (cameraClick) {
            cameraX?.gateValue.setValue(0.5);
            cameraY?.gateValue.setValue(0.53);
        } else {
            setCameraLastMove([getX(ev), getY(ev)]);
            setCameraMoveActive(true);
            setCameraClick(true);
            setTimeout(() => setCameraClick(false), 500);
        }
    }

    const onCameraMouseUp = () => {
        setCameraMoveActive(false);
    }

    const onCameraMove = (ev: any) => {
        if (!cameraMoveActive || (!ev.changedTouches && !ev.screenX && !ev.screenY)) return;
        cameraX?.gateValue.setValue((currentCameraX ?? 0) - (getX(ev) - cameraLastMove[0]) * cameraSensitivity);
        cameraY?.gateValue.setValue((currentCameraY ?? 0) + (getY(ev) - cameraLastMove[1]) * cameraSensitivity);
        setCameraLastMove([getX(ev), getY(ev)]);
    }

    const onKeyDown = (ev: any) => {
        const key = ev.key + 'º';
        if ((keyEvents?.value !== undefined) && (keyEvents.value.indexOf(key) === -1)) {
            keyEvents.setValue(keyEvents.value + key);
        }
    }

    const onKeyUp = (ev: any) => {
        const key = ev.key + 'º';
        if (keyEvents?.value) {
            keyEvents.setValue(keyEvents.value.replace(key, ''));
        }
    }

    useEffect(() => {
        if (keyEvents) {
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            const interval = setInterval(() => {
                if (keyEvents.value && (keyEvents.value.length > 0)) {
                    keyEvents.setValue(keyEvents.value, false);
                }
            }, 100);
            return () => {
                clearInterval(interval)
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            };
        }
    }, [keyEvents]);

    useEffect(() => {
        setCamera(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Video')?.modelValue);
        setCameraX(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Camera X'));
        setCameraY(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Camera Y'));
        setKeyEvents(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Key events')?.gateValue);
    }, [deviceModel]);

    useEffect(() => {
        const matcher = (model: DeviceModel) => model.info.value === 'SGTrackedRobot';
        const subscription = new DeviceSubscription(systemModel, matcher);
        setDeviceModel(subscription.deviceModel);
        subscription.onModelUpdate = (newModel) => setDeviceModel(newModel);
        // document.body.requestFullscreen();
        // setTimeout(() => {
        //     document.exitFullscreen();
        // }, 5000);

        return () => {
            subscription.close();
        };
    }, []);

    useEffect(() => {
        setCameraSize();
        window.addEventListener("resize", setCameraSize);
        return () => window.removeEventListener("resize", setCameraSize);
    }, [cameraRef.current]);

    return (
        <div className={styles.mainContainer}>
            {deviceModel &&
                <>
                    <div className={styles.leftPanel}>Test</div>
                    <div
                        className={styles.cameraPanel}
                        ref={cameraRef}
                        draggable="false"
                        onMouseDown={onCameraMouseDown}
                        onTouchStart={onCameraMouseDown}
                        onMouseUp={onCameraMouseUp}
                        onTouchEnd={onCameraMouseUp}
                        onMouseMove={onCameraMove}
                        onTouchMove={onCameraMove}
                        onMouseLeave={onCameraMouseUp}
                    >
                        <Camera input={camera} width={cameraWidth} height={cameraHeight}/>
                    </div>
                </>
            }
            {!deviceModel &&
                <div>Device unavailable</div>
            }
        </div>
    )
}

export default TrackedRobot;
