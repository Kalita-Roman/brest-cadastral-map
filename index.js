'use strict'

//import express from "express";
var express = require('express');
var app = express();


app.use('/build', express.static('build'));
app.use('/css', express.static('css'));
app.use('/', express.static('map'));

app.get('/', function (req, res) {
  	res.sendFile('index.html', { root: __dirname } , (e) => { if(e) console.log(e); });
});

app.listen(8080, function () {
  	console.log('Example app listening on port 8080!');
});