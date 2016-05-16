'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var upload = require('multer')();  // for parsing multipart/form-data
var db = require('./database/db.js').database;

//var upload = multer(); // for parsing multipart/form-data
var app = express();

app.use('/build', express.static('build'));
app.use('/css', express.static('css'));
app.use('/', express.static('map'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  	res.sendFile('index.html', { root: __dirname } , (e) => { if(e) console.log(e); });
});

app.post('/db', upload.array(), db);

app.listen(8080, function () {
  	console.log('Example app listening on port 8080!');
});