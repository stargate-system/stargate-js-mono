import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { GateDevice, Directions, ValueVisibility } from "@stargate-system/device";
import { GateBoolean, GateNumber, GateString } from "@stargate-system/core";
import settings from "../utils/settings";

let camera: ChildProcessWithoutNullStreams | undefined;
let buffer: Buffer | undefined;
let video: GateString;
let useGain: GateBoolean;
let gain: GateNumber;

const init = () => {
    const {camera} = settings.getSettings();

    useGain = GateDevice.factory.createBoolean(Directions.input);
    useGain.valueName = 'Use gain';
    useGain.visibility = ValueVisibility.settings;
    useGain.setValue(camera.useGain);
    useGain.onRemoteUpdate = () => {
        if (useGain.value !== undefined) {
            camera.useGain = useGain.value;
            settings.save();
        }
    }

    gain = GateDevice.factory.createFloat(Directions.input);
    gain.valueName = 'Gain';
    gain.visibility = ValueVisibility.settings;
    gain.setRange([0.1, 20]);
    gain.setValue(camera.gain);
    gain.onRemoteUpdate = () => {
        if (gain.value !== undefined) {
            camera.gain = gain.value;
            settings.save();
        }
    }

    video = GateDevice.factory.createString(Directions.output);
    video.valueName = "Camera";
    video.visibility = ValueVisibility.hidden;
    video.onSubscriptionChange = (subscribed) => {
        if (subscribed) {
            startCamera();
        } else {
            stopCamera();
        }
    }
}

const basicSettings = [
    '-t', '0',
    '-o', '-',
    '--width', '640',
    '--height', '480',
    '--framerate', '30',
    '--codec', 'mjpeg',
    '-n'
];

const getSettings = () => {
    const settings = [...basicSettings];
    if (useGain.value) {
        settings.push('--gain');
        settings.push(gain.value?.toString() ?? '1');
    }
    return settings;
}

const startCamera = () => {
    if (!camera) {
        camera = spawn('rpicam-vid', getSettings());
        camera.stdout.on('data', handleData);
    }
}

const handleData = (chunk: Buffer) => {
    const frameStartIndex = getFrameStart(chunk);
    if (buffer === undefined) {
        if (!frameStartIndex || frameStartIndex === 0) {
            buffer = chunk;
        } else {
            buffer = chunk.subarray(0, frameStartIndex);
            pushBuffer();
            buffer = chunk.subarray(frameStartIndex);
        }
    } else {
        if (!frameStartIndex) {
            buffer = Buffer.concat([buffer, chunk]);
        } else if (frameStartIndex === 0) {
            pushBuffer();
            buffer = chunk;
        } else {
            buffer = Buffer.concat([buffer, chunk.subarray(0, frameStartIndex)]);
            pushBuffer();
            buffer = chunk.subarray(frameStartIndex);
        }
    }
};

const getFrameStart = (chunk: Buffer) => {
    for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === 0xFF) {
            if (chunk[i + 1] === 0xD8) {
                return i;
            }
        }
    }
    return undefined;
}

const pushBuffer = () => {
    if (buffer) {
        video.setValue(buffer.toString('base64'));
        buffer = undefined;
    }
}

const stopCamera = () => {
    if (camera) {
        camera.kill();
        camera = undefined;
        buffer = undefined;
        video.setValue(undefined);
    }
}

const cameraApi = {
    init
}

export default cameraApi;