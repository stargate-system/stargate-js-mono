import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";
import { DeviceModel, DeviceSubscription, GateValueModel, ModelValue } from "@stargate-system/model";
import { useRef, useContext, useState, useEffect } from "react";
import styles from './TrackedRobot.module.css';
import Camera from "./components/Camera/Camera";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import { GateString } from "@stargate-system/core";
import DivWithPointer from "./components/DivWithPointer/DivWithPointer";
import { faExpand, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
import InfoPanel from "./components/InfoPanel/InfoPanel";

const baseHeadSensitivity = 1;
const baseChassisSensitivity = 3;
let chassis = {keys: ''};

const TrackedRobot = () => {
    const systemModel = useContext(SystemModelContext);
    const [deviceModel, setDeviceModel] = useState<DeviceModel | undefined>();
    const [camera, setCamera] = useState<ModelValue<string> | undefined>();
    const [headX, setHeadX] = useState<GateValueModel | undefined>();
    const [headY, setHeadY] = useState<GateValueModel | undefined>();
    const currentHeadX = useModelValue(headX?.modelValue as ModelValue<number>);
    const currentHeadY = useModelValue(headY?.modelValue as ModelValue<number>);
    const [headCommand, setHeadCommand] = useState([0, 0]);
    const [cameraWidth, setCameraWidth] = useState<string | undefined>();
    const [cameraHeight, setCameraHeight] = useState<string | undefined>();
    const cameraRef = useRef<HTMLDivElement | null>(null);
    const sidePanelRef = useRef<HTMLDivElement | null>(null);
    const [headSensitivity, setCameraSensitivity] = useState(0.001);
    const [chassisSensitivity, setChassisSensitivity] = useState(0.001);
    const [chassisCommand, setChassisCommand] = useState<GateString | undefined>();
    const [chassisX, setChassisX] = useState(0);
    const [chassisY, setChassisY] = useState(0);
    const [panelVisible, setPanelVisible] = useState(true);
    const [flashlight, setFlashlight] = useState<GateValueModel | undefined>();
    const flashlightState = useModelValue(flashlight?.modelValue);
    const [headCenterX, setHeadCenterX] = useState<ModelValue<number> | undefined>();
    const currentHeadCenterX = useModelValue(headCenterX);
    const [headCenterY, setHeadCenterY] = useState<ModelValue<number> | undefined>();
    const currentHeadCenterY = useModelValue(headCenterY);
    const [fps, setFps] = useState(0);

    const setCameraSize = () => {
        if (cameraRef.current) {
            const ratio = cameraRef.current.offsetWidth / cameraRef.current.offsetHeight;
            if (ratio >= (4/3)) {
                setCameraHeight((cameraRef.current.clientHeight > 800 ? 800 : cameraRef.current.clientHeight).toString());
                setCameraWidth(undefined);
                setCameraSensitivity(baseHeadSensitivity / cameraRef.current.clientHeight);
            } else {
                setCameraWidth(cameraRef.current.clientWidth.toString());
                setCameraHeight(undefined);
                setCameraSensitivity(baseHeadSensitivity / cameraRef.current.clientWidth);
            }
        }
        if (sidePanelRef.current) {
            setChassisSensitivity(baseChassisSensitivity / sidePanelRef.current.clientWidth);
        }
    }

    const onCameraClick = () => {
        setHeadCommand([currentHeadX ?? 0, currentHeadY ?? 0]);
    }

    const onCameraMove = (x: number, y: number) => {
        const command = [headCommand[0] - x * headSensitivity, headCommand[1] + y * headSensitivity];
        headX?.gateValue.setValue(command[0]);
        headY?.gateValue.setValue(command[1]);
        setHeadCommand(command);
    }

    const onCameraDoubleClick = () => {
        headX?.gateValue.setValue(currentHeadCenterX);
        headY?.gateValue.setValue(currentHeadCenterY);
    }

    const onChassisMove = (x: number, y: number) => {
        const currentX = normalize(chassisX + x * chassisSensitivity);
        const currentY = normalize(chassisY - y * chassisSensitivity);
        chassisCommand?.setValue(currentY + ':' + currentX);
        setChassisX(currentX);
        setChassisY(currentY);
    }

    const normalize = (value: number) => {
        if (value < -1) {
            return -1;
        }
        if (value > 1) {
            return 1;
        }
        return value;
    }

    const onChassisReleased = () => {
        chassisCommand?.setValue('0:0');
        setChassisX(0);
        setChassisY(0);
    }

    const onKeyDown = (ev: any) => {
        const key = ev.key;
        if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
            if (!chassis.keys.includes(key)) {
                chassis.keys = chassis.keys + key;
                applyKeys();
            }
        } else if (key === 'f') {
            onFlashlightClick();
        }
    }

    const onKeyUp = (ev: any) => {
        const key = ev.key;
        if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
            chassis.keys = chassis.keys.replace(key, '');
            applyKeys();
        }
    }

    const applyKeys = () => {
        const forward = chassis.keys.includes('w');
        const reverse = chassis.keys.includes('s');
        const left = chassis.keys.includes('a');
        const right = chassis.keys.includes('d');
        let command = '';
        if ((!forward && !reverse) || (forward && reverse)) {
            command += 0;
        } else {
            if (forward) {
                command += 1;
            } else {
                command += -1;
            }
        }
        command += ':';
        if ((!left && !right) || (left && right)) {
            command += 0;
        } else {
            if (left) {
                command += -1;
            } else {
                command += 1;
            }
        }
        chassisCommand?.setValue(command);
    }

    const onPanelButtonClick = () => {
        setPanelVisible(!panelVisible);
    }
    const onFullscreenClick = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }
    }

    const onFlashlightClick = () => {
        if (flashlight) {
            flashlight.gateValue.setValue(!flashlight.gateValue.value);
        }
    }

    useEffect(() => {
        if (chassisCommand) {
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            const interval = setInterval(() => {
                if (chassisCommand.value) {
                    chassisCommand.setValue(chassisCommand.value, false);
                }
            }, 100);
            return () => {
                clearInterval(interval)
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            };
        }
    }, [chassisCommand]);

    useEffect(() => {
        setCamera(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Camera')?.modelValue);
        setHeadX(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Head X'));
        setHeadY(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Head Y'));
        setChassisCommand(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Chassis command')?.gateValue);
        setFlashlight(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Light'));
        setHeadCenterX(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Head center X')?.modelValue);
        setHeadCenterY(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Head center Y')?.modelValue);
    }, [deviceModel]);

    useEffect(() => {
        setCameraSize();
        window.addEventListener("resize", setCameraSize);
        return () => window.removeEventListener("resize", setCameraSize);
    }, [cameraRef.current]);

    useEffect(() => {
        const matcher = (model: DeviceModel) => model.info.value === 'SGTrackedRobot';
        const subscription = new DeviceSubscription(systemModel, matcher);
        setDeviceModel(subscription.deviceModel);
        subscription.onModelUpdate = (newModel) => setDeviceModel(newModel);

        return () => {
            subscription.close();
        };
    }, []);

    return (
        <div className={styles.mainContainer}>
            {deviceModel &&
                <>
                    {panelVisible &&
                        <div ref={sidePanelRef} className={styles.leftPanel}>
                            <DivWithPointer
                                className={styles.fullSize}
                                onPointerReleased={onChassisReleased}
                                onPointerMove={onChassisMove}
                            >
                                <InfoPanel device={deviceModel} fps={fps}/>
                            </DivWithPointer>
                        </div>
                    }
                    <div ref={cameraRef} className={styles.cameraPanel}>
                        <DivWithPointer
                            className={styles.fullSize}
                            onPointerActive={onCameraClick}
                            onPointerMove={onCameraMove}
                            onDoubleClick={onCameraDoubleClick}
                        >
                            <Camera
                                input={camera}
                                width={cameraWidth}
                                height={cameraHeight}
                                onFpsChange={setFps}
                            />
                        </DivWithPointer>
                    </div>
                    <div className={styles.buttonPanel}>
                        <button onClick={onPanelButtonClick} className={styles.button}>
                            <FontAwesomeIcon icon={faTableColumns} className={`${panelVisible ? styles.buttonActive : styles.buttonInactive}`}/>
                        </button>
                        {panelVisible &&
                            <>
                                <button onClick={onFullscreenClick} className={styles.button}>
                                    <FontAwesomeIcon icon={faExpand} className={`${document.fullscreenElement ? styles.buttonActive : styles.buttonInactive}`}/>
                                </button>
                                {flashlight &&
                                    <button onClick={onFlashlightClick} className={styles.button}>
                                        <FontAwesomeIcon icon={faLightbulb} className={`${flashlightState ? styles.buttonActive : styles.buttonInactive}`}/>
                                    </button>
                                }
                            </>
                        }
                    </div>
                </>
            }
            {!deviceModel &&
                <div className={styles.deviceUnavailable}>Device unavailable</div>
            }
        </div>
    )
}

export default TrackedRobot;
