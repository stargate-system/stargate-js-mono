import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";
import { DeviceModel, DeviceSubscription, GateValueModel, ModelValue } from "@stargate-system/model";
import { useRef, useContext, useState, useEffect } from "react";
import styles from './TrackedRobot.module.css';
import Camera from "../common/Camera/Camera";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import { GateString } from "@stargate-system/core";
import DivWithPointer from "./components/DivWithPointer/DivWithPointer";

const baseCameraSensitivity = 1;
const baseChassisSensitivity = 3;
let chassis = {keys: ''};

const TrackedRobot = () => {
    const systemModel = useContext(SystemModelContext);
    const [deviceModel, setDeviceModel] = useState<DeviceModel | undefined>();
    const [camera, setCamera] = useState<ModelValue<string> | undefined>();
    const [cameraX, setCameraX] = useState<GateValueModel | undefined>();
    const [cameraY, setCameraY] = useState<GateValueModel | undefined>();
    const [cameraWidth, setCameraWidth] = useState<string | undefined>();
    const [cameraHeight, setCameraHeight] = useState<string | undefined>();
    const cameraRef = useRef<HTMLDivElement | null>(null);
    const sidePanelRef = useRef<HTMLDivElement | null>(null);
    const currentCameraX = useModelValue(cameraX?.modelValue as ModelValue<number>);
    const currentCameraY = useModelValue(cameraY?.modelValue as ModelValue<number>);
    const [cameraSensitivity, setCameraSensitivity] = useState(0.001);
    const [chassisSensitivity, setChassisSensitivity] = useState(0.001);
    const [chassisCommand, setChassisCommand] = useState<GateString | undefined>();
    const [chassisX, setChassisX] = useState(0);
    const [chassisY, setChassisY] = useState(0);

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
        if (sidePanelRef.current) {
            setChassisSensitivity(baseChassisSensitivity / sidePanelRef.current.clientWidth);
        }
    }

    const onCameraMove = (x: number, y: number) => {
        cameraX?.gateValue.setValue((currentCameraX ?? 0) - x * cameraSensitivity);
        cameraY?.gateValue.setValue((currentCameraY ?? 0) + y * cameraSensitivity);
    }

    const onCameraDoubleClick = () => {
        cameraX?.gateValue.setValue(0.5);
        cameraY?.gateValue.setValue(0.53);
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
        setCamera(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Video')?.modelValue);
        setCameraX(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Camera X'));
        setCameraY(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Camera Y'));
        setChassisCommand(deviceModel?.gateValues.find((value) => value.gateValue.valueName === 'Chassis command')?.gateValue);
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
                    <div ref={sidePanelRef} className={styles.leftPanel}>
                        <DivWithPointer
                            className={styles.fullSize}
                            onPointerReleased={onChassisReleased}
                            onPointerMove={onChassisMove}
                        >
                            Test
                        </DivWithPointer>
                    </div>
                    <div ref={cameraRef} className={styles.cameraPanel}>
                        <DivWithPointer
                            className={styles.fullSize}
                            onPointerMove={onCameraMove}
                            onDoubleClick={onCameraDoubleClick}
                        >
                            <Camera input={camera} width={cameraWidth} height={cameraHeight}/>
                        </DivWithPointer>
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
