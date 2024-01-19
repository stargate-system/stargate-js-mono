export const autostart = [
    ["../..", "USE_PING=true npm run device:local"],
    ["../..", "npm run device:test"],
    ["../../examples/PipedDevices/PipeTest1", "npm run start"],
    ["../../examples/PipedDevices/PipeTest2", "npm run start"]
];