// @ts-ignore
import core from 'gatecore';
// @ts-ignore
// import {Registry, SocketHandler} from 'gatecore';
// import {Device} from "./Device.js";
//
//
// let ctrl: Object;
// const deviceRegistry = new Registry();
//
// const routeDeviceMessage = (id: string, message: string) => {
//     ctrl.onDeviceMessage(message);
// }
//
// const routeControllerMessage = (message: string) => {
//     const device = deviceRegistry.getByKey(id);
//     if (device) {
//         device.socketHandler.sendFunction(message);
//     }
// }
//
// const performHandShake = (device: Device, socket) => {
//     const manifest = device.socketHandler.functionalHandler.createQuery(core.ApiCommons.Messages.manifest);
//     const values = device.socketHandler.functionalHandler.createQuery(core.ApiCommons.Messages.allStates);
//     Promise.all([manifest, values]).then((res) => {
//         const manifest = JSON.parse(res[0]);
//         manifest.deviceId = device.id;
//         device.manifest = manifest;
//         ctrl.initDevice(manifest, res[1]);
//         device.socketHandler.functionalHandler.sendInfo(core.ApiCommons.Messages.ready);
//     }).catch((reason) => {
//         // TODO logging
//         console.log('Connection failed: ' + reason);
//         socket.close();
//     });
// }
//
// const removeDevice = (id) => {
//     // TODO implement
//     deviceRegistry.remove(id);
//     ctrl.deviceRemoved(id);
// }
//
// const initRouter = (controller, sockets) => {
//     core.config.outputBufferSendFunction = (message: string) => {
//         routeControllerMessage(message);
//     }
//     ctrl = controller;
//     sockets.forEach((socket) => {
//         const deviceId = deviceRegistry.generateKey();
//         const device = new Device(deviceId);
//         deviceRegistry.add(device, deviceId);
//         socket.on('close', () => {
//             removeDevice(deviceId);
//         });
//         const socketHandler = new SocketHandler(socket.send, (msg) => routeDeviceMessage(deviceId, msg));
//         device.socketHandler = socketHandler;
//         socket.on('message', socketHandler.onMessage);
//         performHandShake(device, socket);
//     });
// }