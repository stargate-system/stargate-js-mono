import express from 'express';
import {Router} from 'gate-router';

const app = express();
const port = process.env.PORT || 8080;
app.use('/test', express.static(__dirname + '/../out'));

// sendFile will go here
// @ts-ignore
app.get('/', function(req, res) {
    res.redirect('/test/index.html');
});

app.listen(port);
console.log('Server started at http://localhost:' + port);

console.log(Router.extractTargetId('aa:bb'));