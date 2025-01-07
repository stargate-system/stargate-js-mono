"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const device_1 = require("@stargate-system/device");
let camera;
let buffer;
let video;
const init = () => {
    video = device_1.GateDevice.factory.createString(device_1.Directions.output);
    video.valueName = "Video";
    video.visibility = device_1.ValueVisibility.hidden;
    video.onSubscriptionChange = (subscribed) => {
        if (subscribed) {
            startCamera();
        }
        else {
            stopCamera();
        }
    };
};
const startCamera = () => {
    if (!camera) {
        camera = (0, child_process_1.spawn)('rpicam-vid', [
            '-t', '0',
            '-o', '-',
            '--width', '640',
            '--height', '480',
            '--framerate', '30',
            '--codec', 'mjpeg',
            '-n',
            '--gain', '13'
        ]);
        camera.stdout.on('data', handleData);
    }
};
const handleData = (chunk) => {
    const frameStartIndex = getFrameStart(chunk);
    if (buffer === undefined) {
        if (!frameStartIndex || frameStartIndex === 0) {
            buffer = chunk;
        }
        else {
            buffer = chunk.subarray(0, frameStartIndex);
            pushBuffer();
            buffer = chunk.subarray(frameStartIndex);
        }
    }
    else {
        if (!frameStartIndex) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        else if (frameStartIndex === 0) {
            pushBuffer();
            buffer = chunk;
        }
        else {
            buffer = Buffer.concat([buffer, chunk.subarray(0, frameStartIndex)]);
            pushBuffer();
            buffer = chunk.subarray(frameStartIndex);
        }
    }
};
const getFrameStart = (chunk) => {
    for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === 0xFF) {
            if (chunk[i + 1] === 0xD8) {
                return i;
            }
        }
    }
    return undefined;
};
const pushBuffer = () => {
    if (buffer) {
        video.setValue(buffer.toString('base64'));
        buffer = undefined;
    }
};
const stopCamera = () => {
    if (camera) {
        camera.kill();
        camera = undefined;
        buffer = undefined;
        video.setValue(undefined);
    }
};
const cameraApi = {
    init
};
exports.default = cameraApi;
