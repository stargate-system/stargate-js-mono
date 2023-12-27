import express from 'express';
import {initDiscovery} from "./src/DiscoveryService";
import getBasicRepository from "./src/persistence/BasicSystemRepository";
import {initConnectionService} from "./src/ConnectionService";
import Router from "./src/Router";
import {initDeviceContext} from "./src/device/DeviceContext";

const app = express();
const port = process.env.PORT || 8080;
app.use('/ui', express.static(__dirname + '/../out'));

app.get('/', function(req, res) {
    res.redirect('/ui/index.html');
});

app.listen(port);
Router.systemRepository = getBasicRepository();
initDeviceContext().then(() => {
    initDiscovery();
    initConnectionService();
})
