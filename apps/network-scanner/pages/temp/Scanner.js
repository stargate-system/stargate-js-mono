var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var PORT = 10000;
var SCAN_TIMEOUT = 16000;
var SOCKET_TIMEOUT = 7000;
var NETWORK_PROBE_LSB = 254;
var MAX_NETWORKS = 3;
var allowedIpRange = [
    { fixedBytes: [192, 168] },
    { fixedBytes: [172], secondByteLimit: [16, 31] },
    { fixedBytes: [10] },
];
var generateAllFromPattern = function (pattern, limit) {
    var ips = [];
    var range = limit !== null && limit !== void 0 ? limit : [0, 255];
    for (var i = range[0]; i <= range[1]; i++) {
        ips.push(pattern.replace("x", i.toString()));
    }
    return ips;
};
var createSocket = function (url) { return __awaiter(_this, void 0, void 0, function () {
    var socket, resourcesAvailable;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                socket = new WebSocket("ws://" + url + ":" + PORT);
                return [4 /*yield*/, new Promise(function (resolve) {
                        // Checking if socket was not closed immediately after creation due to insufficient resources
                        setTimeout(function () {
                            if (socket.readyState === WebSocket.CONNECTING) {
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        }, 0);
                    })];
            case 1:
                resourcesAvailable = _a.sent();
                return [2 /*return*/, resourcesAvailable ? socket : null];
        }
    });
}); };
var abortScanIpList;
var scanIpList = function (list, onEvent) { return __awaiter(_this, void 0, void 0, function () {
    var socketsTotal, socketsScanned, proceed, allSocketsResolved, abort, socketScanned, scanTimeout, _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                socketsTotal = list.length;
                socketsScanned = 0;
                proceed = function () { };
                allSocketsResolved = function () { };
                abort = false;
                socketScanned = function () {
                    if (socketsTotal === ++socketsScanned) {
                        allSocketsResolved();
                    }
                };
                abortScanIpList = function () {
                    abort = true;
                    proceed();
                    allSocketsResolved();
                    abortScanIpList = function () { };
                };
                scanTimeout = setTimeout(abortScanIpList, SCAN_TIMEOUT);
                _loop_1 = function () {
                    var socket;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, createSocket(list[0])];
                            case 1:
                                socket = _b.sent();
                                if (!(socket === null)) return [3 /*break*/, 3];
                                // waiting till some already open socket got closed so new one can be opened
                                // @ts-ignore
                                return [4 /*yield*/, new Promise(function (resolve) { return proceed = resolve; })];
                            case 2:
                                // waiting till some already open socket got closed so new one can be opened
                                // @ts-ignore
                                _b.sent();
                                proceed = function () { };
                                return [3 /*break*/, 4];
                            case 3:
                                socket.onclose = function () {
                                    proceed();
                                };
                                socket.onerror = function (ev) {
                                    socketScanned();
                                    onEvent(ev);
                                };
                                socket.onopen = function (ev) {
                                    socketScanned();
                                    onEvent(ev);
                                };
                                setTimeout(function () {
                                    if (socket.readyState === WebSocket.CONNECTING) {
                                        socket.onerror = undefined;
                                        socket.onopen = undefined;
                                        socket.close();
                                        socketScanned();
                                    }
                                }, SOCKET_TIMEOUT);
                                list.shift();
                                _b.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!(list.length && !abort)) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_1()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3:
                if (!!abort) return [3 /*break*/, 5];
                // @ts-ignore
                return [4 /*yield*/, new Promise(function (resolve) { return allSocketsResolved = resolve; })];
            case 4:
                // @ts-ignore
                _a.sent();
                _a.label = 5;
            case 5:
                clearTimeout(scanTimeout);
                return [2 /*return*/];
        }
    });
}); };
var generateIpList = function (range) {
    var iplist = [];
    var secondByteStartValue = 0;
    var secondByteEndValue = 255;
    if (range.fixedBytes.length === 2) {
        secondByteStartValue = range.fixedBytes[1];
        secondByteEndValue = secondByteStartValue;
    }
    else if (range.secondByteLimit) {
        secondByteStartValue = range.secondByteLimit[0];
        secondByteEndValue = range.secondByteLimit[1];
    }
    for (var secondByte = secondByteStartValue; secondByte <= secondByteEndValue; secondByte++) {
        var pattern = range.fixedBytes[0] + "." + secondByte + ".x." + NETWORK_PROBE_LSB;
        iplist.push.apply(iplist, generateAllFromPattern(pattern));
    }
    return iplist;
};
var scanRangeForNetworks = function (ipRange) { return __awaiter(_this, void 0, void 0, function () {
    var list, networks, aborted;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startProgress();
                startButton.innerHTML = "Detecting networks...";
                list = generateIpList(ipRange);
                networks = [];
                aborted = false;
                return [4 /*yield*/, scanIpList(list, function (ev) {
                        var socket = ev.target;
                        var url = socket.url.replace("ws://", "").replace(NETWORK_PROBE_LSB + ":10000/", "x");
                        if (socket.readyState !== WebSocket.CLOSED) {
                            socket.close();
                        }
                        networks.push(url);
                        if (networks.length > MAX_NETWORKS) {
                            if (!aborted) {
                                abortScanIpList();
                                displayFindings([], foundNetworksContainer);
                                aborted = true;
                            }
                        }
                        else {
                            displayFindings(networks, foundNetworksContainer);
                        }
                    })];
            case 1:
                _a.sent();
                stopProgress();
                if (!(networks.length === 0 || networks.length > MAX_NETWORKS)) return [3 /*break*/, 2];
                displayScanFailed('Scanner was unable to automatically select networks to scan' +
                    ' Please check if given IP range is correct or provide 3rd number to narrow down scan range' +
                    ' <a href="https://support.microsoft.com/en-us/windows/find-your-ip-address-in-windows-f21a9bbc-c582-55cd-35e0-73431160a1b9" target="_blank" rel="noopener noreferrer">' +
                    'How to check my IP address?</a>');
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, scanNetworksForDevices(networks)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                scanFinished();
                return [2 /*return*/];
        }
    });
}); };
var scanNetworksForDevices = function (patterns) { return __awaiter(_this, void 0, void 0, function () {
    var pattern, ipList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                startProgress();
                _a.label = 1;
            case 1:
                if (!patterns.length) return [3 /*break*/, 3];
                pattern = patterns.shift();
                startButton.innerHTML = "Scanning " + pattern;
                ipList = generateAllFromPattern(pattern, [0, 254]);
                return [4 /*yield*/, scanIpList(ipList, function (ev) {
                        var socket = ev.target;
                        if (socket.readyState === WebSocket.OPEN) {
                            openSockets.push(socket);
                            displayFindings(openSockets.map(function (sck) { return sck.url; }), connectedDevicesContainer);
                        }
                    })];
            case 2:
                _a.sent();
                if (openSockets.length) {
                    return [3 /*break*/, 3];
                }
                return [3 /*break*/, 1];
            case 3:
                stopProgress();
                if (!openSockets.length) {
                    displayScanFailed("No devices found on given networks. Check if IP address range is correct and devices are ready to accept connections");
                }
                return [2 /*return*/];
        }
    });
}); };
var scanPatternForDevices = function (pattern) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scanNetworksForDevices([pattern])];
            case 1:
                _a.sent();
                scanFinished();
                return [2 /*return*/];
        }
    });
}); };
// ---------------GUI----------------
var startButton = document.querySelector("button.startButton");
var scanRunningContainer = document.querySelector("#scanRunningContainer");
var foundNetworksContainer = document.querySelector("#foundNetworksContainer");
var connectedDevicesContainer = document.querySelector("#connectedDevicesContainer");
var scanFailedContainer = document.querySelector("#scanFailedContainer");
var ipContainer = document.querySelector("div.ipContainer");
var byte1 = document.querySelector("#byte1");
var byte2 = document.querySelector("#byte2");
var byte3 = document.querySelector("#byte3");
var displayScanFailed = function (message) {
    // @ts-ignore
    scanFailedContainer.style.display = message ? 'flex' : 'none';
    scanFailedContainer.innerHTML = message !== null && message !== void 0 ? message : "";
    // @ts-ignore
    ipContainer.style.border = message ? "2px solid green" : "none";
};
var displayFindings = function (list, parent) {
    var listElement = parent.querySelector("ul.list");
    while (listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
    }
    if (list.length) {
        // @ts-ignore
        parent.style.display = 'flex';
        list.forEach(function (net) {
            var li = document.createElement('li');
            li.innerText = net;
            listElement.appendChild(li);
        });
    }
    else {
        // @ts-ignore
        parent.style.display = 'none';
    }
};
var validateByte1 = function () {
    // @ts-ignore
    var ipRange = allowedIpRange.find(function (range) { return range.fixedBytes[0] === parseInt(byte1.value.trim()); });
    if (ipRange !== undefined) {
        // @ts-ignore
        byte1.style.color = "black";
    }
    else {
        // @ts-ignore
        byte1.style.color = "red";
        // @ts-ignore
        byte2.style.color = "black";
    }
    return ipRange;
};
var isBetween = function (x, min, max) {
    return x >= min && x <= max;
};
var validateByte2 = function (ipRange) {
    // @ts-ignore
    var byte2Value = parseInt(byte2.value.trim());
    if (ipRange.fixedBytes[1] === byte2Value
        || (ipRange.secondByteLimit !== undefined
            && isBetween(byte2Value, ipRange.secondByteLimit[0], ipRange.secondByteLimit[1]))) {
        // @ts-ignore
        byte2.style.color = "black";
        return true;
    }
    else {
        // @ts-ignore
        byte2.style.color = "red";
        return false;
    }
};
var validateByte3 = function () {
    // @ts-ignore
    var byte3Value = byte3.value.trim().length ? parseInt(byte3.value.trim()) : undefined;
    if (byte3Value === undefined || isBetween(byte3Value, 0, 255)) {
        // @ts-ignore
        byte3.style.color = "black";
        return true;
    }
    else {
        // @ts-ignore
        byte3.style.color = "red";
        return false;
    }
};
var validateIp = function () {
    var ipRange = validateByte1();
    if (ipRange !== undefined) {
        if (validateByte2(ipRange)) {
            if (validateByte3()) {
                return true;
            }
        }
    }
    return false;
};
byte1.addEventListener('blur', validateIp);
byte2.addEventListener('blur', validateIp);
byte3.addEventListener('blur', validateIp);
var scanFinished = function () {
    startButton.innerHTML = "Start scan";
    // @ts-ignore
    startButton.disabled = false;
};
// @ts-ignore
var progressInterval;
var progressValue;
var startProgress = function () {
    var estimatedFinish = 2 * SOCKET_TIMEOUT;
    progressValue = 0;
    progressInterval = setInterval(addProgress, estimatedFinish / 100);
};
var addProgress = function () {
    if (progressValue < 100) {
        progressValue++;
        // @ts-ignore
        startButton.style.backgroundImage = "linear-gradient(to right, limegreen " + progressValue + "%, beige " + progressValue + "%)";
    }
};
var stopProgress = function () {
    clearInterval(progressInterval);
    // @ts-ignore
    startButton.style.backgroundImage = "";
};
// -------------Entry point--------------
var openSockets = [];
var getIpRange = function () {
    // @ts-ignore
    var byte1Value = parseInt(byte1.value.trim());
    // @ts-ignore
    var byte2Value = parseInt(byte2.value.trim());
    // @ts-ignore
    var byte3Value = parseInt(byte3.value.trim());
    var ipRange = {
        fixedBytes: [byte1Value, byte2Value]
    };
    if (Number.isInteger(byte3Value)) {
        ipRange.fixedBytes.push(byte3Value);
    }
    return ipRange;
};
var startCallback = function () {
    if (validateIp()) {
        // @ts-ignore
        startButton.disabled = true;
        var ipRange = getIpRange();
        openSockets.forEach(function (socket) { return socket.close(); });
        openSockets = [];
        if (ipRange.fixedBytes.length === 2) {
            scanRangeForNetworks(ipRange);
        }
        else {
            scanPatternForDevices(ipRange.fixedBytes[0] + "." + ipRange.fixedBytes[1] + "." + ipRange.fixedBytes[2] + ".x");
        }
        // @ts-ignore
        scanRunningContainer.style.display = 'flex';
        displayFindings([], foundNetworksContainer);
        displayFindings([], connectedDevicesContainer);
        displayScanFailed();
    }
};
startButton.addEventListener("click", startCallback);
