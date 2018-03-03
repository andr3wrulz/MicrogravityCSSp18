// Imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var router = express.Router();
var path = require('path');

// Variables
var port = process.env.PORT || 8080;

// Middleware - Order matters!
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));// Serve static files in public folder

// Database Connection
var databaseConfig = require('./config/database');
dbConnection = mysql.createConnection(databaseConfig.connectionString); 
dbConnection.connect();

// Api setup
app.use('/api', router);// Serve the api off of ip:port/api/...
require('./app/controllers/api')(router);

// Serve index.html for all possible routes
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Start server
app.listen(port, function() {
	console.log('[SERVER] Ground Control waiting for Major Tom on port: ' + port + '!');
});