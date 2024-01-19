import express from 'express';
import {initDiscovery} from "./src/DiscoveryService";
import getBasicRepository from "./src/persistence/BasicSystemRepository";
import {initConnectionService} from "./src/ConnectionService";
import Router from "./src/Router";
import {initDeviceContext} from "./src/device/DeviceContext";
import config from "./config";

const app = express();
const HTTP_PORT = process.env.HTTP_PORT ?? config.httpPort;
app.use('/ui', express.static(__dirname + '/../out'));

app.get('/', (req, res) => {
    res.redirect('/ui/index.html?connectionPort=' + config.connectionPort);
});

app.listen(HTTP_PORT);
Router.systemRepository = getBasicRepository();
initDeviceContext().then(() => {
    const ENABLE_DISCOVERY = process.env.ENABLE_DISCOVERY ?? config.enableDiscovery;
    if (ENABLE_DISCOVERY) {
        initDiscovery();
    }
    initConnectionService();
})
