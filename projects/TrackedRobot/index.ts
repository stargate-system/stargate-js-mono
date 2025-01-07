import {GateDevice} from "@stargate-system/device";
import events from './src/utils/eventHandler';
import camera from './src/modules/camera';
import head from './src/modules/head';
import chassis from './src/modules/chassis';
import flashlight from './src/modules/flashlight';

GateDevice.setName('Tracked Robot');
GateDevice.setInfo('SGTrackedRobot');

events.init();
camera.init();
head.init();
chassis.init();
flashlight.init();

GateDevice.start();



