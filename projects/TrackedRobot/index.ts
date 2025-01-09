import {GateDevice} from "@stargate-system/device";
import camera from './src/modules/camera';
import head from './src/modules/head';
import chassis from './src/modules/chassis';
import flashlight from './src/modules/flashlight';
import info from './src/modules/info';

GateDevice.setName('Tracked Robot');
GateDevice.setInfo('SGTrackedRobot');

camera.init();
head.init();
chassis.init();
flashlight.init();
info.init();

GateDevice.start();



