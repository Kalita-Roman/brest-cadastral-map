'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var upload = require('multer')();  // for parsing multipart/form-data
var db = require('./database/db.js').database;
var passport = require('./auth').passport;


var app = express();

app.use('/build', express.static('build'));
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

app.post('/db', upload.array(), db);

app.get('/user', function(req, res){
    res.send(false);
});

app.post('/user', 
    require('connect-ensure-login').ensureLoggedIn('/user'),
    upload.array(),
    function(req, res){
        res.send(req.user);
});



app.listen(8080, function () {
  	console.log('Example app listening on port 8080!');
});