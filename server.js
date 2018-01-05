const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const database = require('./config/database.js');

app.use(bodyParser.urlencoded({'extended' : 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type : 'application/vnd.api+json'}));

app.use(express.static(__dirname + '/public/dist', {index : false}));
require('./app/routes.js')(app);

app.listen(8000);
console.log('App listening on port 8000');
