// Imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');// Used for parsing json
var morgan = require('morgan');// Logs all REST calls to console
var mysql = require('mysql');
var router = express.Router();
var path = require('path');

// Variables
var port = process.env.PORT || 8080;

// Middleware - Order matters!
app.use(morgan('dev'));// Do verbose console logging
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));// Serve static files in public folder

// Database Connection
var databaseConfig = require('./config/database');// Pull connection string from config
dbConnection = mysql.createConnection(databaseConfig.connectionString);// Create connection from string
dbConnection.connect();// Initiate connection

// Api setup
app.use('/api', router);// Serve the api off of ip:port/api/...
require('./app/controllers/api')(router);// Import our API

// Serve index.html for all routes not specified
/*app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});*/

// Start server
app.listen(port, function() {
	console.log('[SERVER] Ground Control waiting for Major Tom on port: ' + port + '!');
});