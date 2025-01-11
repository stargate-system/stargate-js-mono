import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";
import { DeviceModel } from "@stargate-system/model";
import InfoItem from "./InfoItem/InfoItem";
import { faFilm, faTemperatureThreeQuarters, faWifi } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface InfoPanelProps {
    device: DeviceModel,
    fps: number
}

const InfoPanel = (props: InfoPanelProps) => {
    const {device, fps} = props;
    const temperature = useModelValue(device.gateValues.find((value) => value.gateValue.valueName === 'CPU Temperature')?.modelValue);
    const [temperatureWarning, setTemperatureWarning] = useState(0);
    const signal = useModelValue(device.gateValues.find((value) => value.gateValue.valueName === 'WiFi Signal')?.modelValue);
    const [signalWarning, setSignalWarning] = useState(0);
    const [signalQuality, setSignalQuality] = useState('');
    const [fpsWarning, setFpsWarning] = useState(0);

    useEffect(() => {
        const value = Number.parseFloat(temperature);
        if (value > 80) {
            setTemperatureWarning(2);
        } else if (value > 70) {
            setTemperatureWarning(1);
        } else {
            setTemperatureWarning(0);
        }
    }, [temperature]);

    useEffect(() => {
        if (signal) {
            const values = signal.split(' ').filter((value: string) => value.length > 0);
            setSignalQuality(values[0]);
            const strength = Number.parseInt(values[1]);
            if (strength < -75) {
                setSignalWarning(2);
            } else if (strength < -67) {
                setSignalWarning(1);
            } else {
                setSignalWarning(0);
            }
        }
    }, [signal]);

    useEffect(() => {
        if (fps < 10) {
            setFpsWarning(2);
        } else if (fps < 20) {
            setFpsWarning(1);
        } else {
            setFpsWarning(0);
        }
    }, [fps]);

    return (
        <div>
            <InfoItem icon={faTemperatureThreeQuarters} warningLevel={temperatureWarning}>{temperature + '°C'}</InfoItem>
            <InfoItem icon={faWifi} warningLevel={signalWarning}>{signalQuality}</InfoItem>
            <InfoItem icon={faFilm} warningLevel={fpsWarning}>{fps + ' fps'}</InfoItem>
        </div>
    )
}

export default InfoPanel;
