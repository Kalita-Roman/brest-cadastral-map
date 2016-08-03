'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var upload = require('multer')();  // for parsing multipart/form-data
var passport = require('./auth').passport;

var db = require('./database/db.js').database;
var longpoll = require('./database/longpoll.js');


var app = express();

app.use('/build', express.static('build'));
app.use('/pictures', express.static('pictures'));
app.use('/css', express.static('css'));
app.use('/', express.static('map'));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
  	res.sendFile('index.html', { root: __dirname } , (e) => { if(e) console.log(e); });
});

app.get('/publish', function (req, res) {
    longpoll.onSubscribe(req, res);
});

app.get('/login',
  	function(req, res) {
        res.sendFile('login.html', { root: __dirname });
  	}
);

app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      	res.redirect('/');
    }
);
  
app.get('/logout',
    function(req, res){
        req.logout();
        res.redirect('/');
    });

app.post('/db', upload.array(), function(req, res){
    db(req, res, longpoll.publish);
});

app.get('/user', function(req, res){
    res.send(false);
});

app.post('/user', 
    require('connect-ensure-login').ensureLoggedIn('/user'),
    upload.array(),
    function(req, res){
        res.send(req.user);
});



if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const config = require('./webpack.dev.config.js')
    const compiler = webpack(config)

    app.use(webpackHotMiddleware(compiler))
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }))
}



var portListening = process.env.PORT || 8080;
app.listen(portListening, function () {
  	console.log('Example app listening on port '+ portListening +' !');
});