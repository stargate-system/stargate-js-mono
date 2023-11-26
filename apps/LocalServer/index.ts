import express from 'express';
import {initDiscovery} from "./src/DiscoveryService";
import {Router} from 'gate-router';
import getBasicRepository from "./src/BasicSystemRepository";
import {initDeviceService} from "./src/DeviceService";
import {initControllerService} from "./src/ControllerService";

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