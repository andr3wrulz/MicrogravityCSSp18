// Imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');// Used for parsing json
var mysql = require('mysql');
var router = express.Router();
var path = require('path');
var passport = require('passport');


// Variables
var port = process.env.PORT || 8080;

// Middleware - Order matters!
app.use(require('morgan')('dev'));// Do verbose console logging
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'super secret session', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
var databaseConfig = require('./config/database');// Pull connection string from config
dbConnection = mysql.createConnection(databaseConfig.connectionString);// Create connection from string
dbConnection.connect();// Initiate connection

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Api setup
app.use('/api', router);// Serve the api off of ip:port/api/...
require('./app/controllers/api')(router, passport);// Import our API

// Setup routes
require('./app/routes')(app, passport, __dirname + '/public/');

// Start server
app.listen(port, function() {
	console.log('[SERVER] Ground Control waiting for Major Tom on port: ' + port + '!');
});