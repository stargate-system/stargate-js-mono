const fs = require('fs');

try {
    fs.rmSync('./apps/LocalServer/out', {recursive: true});
} catch (err) {}

fs.cpSync('./apps/UserInterface/out', './apps/LocalServer/out', {recursive: true});