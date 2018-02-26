// Imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
//var mongoose = require('mongoose');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');

// Variables
var port = process.env.PORT || 8080;

// Middleware - Order matters!
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

// Database Connection
/*mongoose.connect('mongodb://localhost/groundcontrol', function (err){
	if(err) {
		console.log('[ERROR] Not connected to database' + err);
		throw err;
	} else {
		console.log('[SERVER] Connected to database!');
	}
});*/

// Serve index.html for all possible routes
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Start server
app.listen(port, function() {
	console.log('[SERVER] Ground Control waiting for Major Tom on port: ' + port + '!');
});