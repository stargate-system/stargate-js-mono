import fs from 'fs';

let settings = {
    head: {
        horizontalServoPin: 21,
        verticalServoPin: 14,
        horizontalCenter: 0.5,
        verticalCenter: 0.5
    },
    camera: {
        useGain: false,
        gain: 10
    },
    chassis: {
        leftMotorPins: [20, 16],
        rightMotorPins: [26, 19]
    },
    flashlight: {
        pin: 4
    }
};
let saveTimeout: NodeJS.Timeout | undefined;

const getSettings = () => settings;

const save = () => {
    if (saveTimeout === undefined) {
        saveTimeout = setTimeout(() => {
            saveTimeout = undefined;
            fs.writeFile('settings.json', JSON.stringify(settings), (err) => {
                if (err) {
                    console.log('On saving settings', err);
                }
            });
        }, 1000);
    }
}

const init = () => {
    try {
        const settingsFile = fs.readFileSync('settings.json');
        settings = JSON.parse(settingsFile.toString());
    } catch (err) {
        console.log('On loading settings', err);
    }
}

const settingsApi = {
    getSettings,
    save,
    init
}

export default settingsApi;
