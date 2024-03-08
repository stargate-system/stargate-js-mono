const fs = require('fs');

try {
    fs.rmSync('../LocalServer/out', {recursive: true});
} catch (err) {}

fs.cpSync('./out', '../LocalServer/out', {recursive: true});