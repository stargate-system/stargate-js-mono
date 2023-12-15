import express from 'express';
import {initDiscovery} from "./src/DiscoveryService";
import getBasicRepository from "./src/persistence/BasicSystemRepository";
import {initDeviceService} from "./src/device/DeviceService";
import {initControllerService} from "./src/controller/ControllerService";
import Router from "./src/Router";

const app = express();
const port = process.env.PORT || 8080;
app.use('/ui', express.static(__dirname + '/../out'));

app.get('/', function(req, res) {
    res.redirect('/ui/index.html');
});

app.listen(port);
Router.systemRepository = getBasicRepository();
initDiscovery();
initDeviceService();
initControllerService();