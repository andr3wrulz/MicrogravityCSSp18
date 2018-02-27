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
dbConnection = mysql.createConnection( {
      host     : 'localhost',
      user     : 'webuser',
      password : 'Super!Secure',
      database : 'ground_control',
 }); 
 dbConnection.connect();
 
 // Api setup
 app.use('/api', router);// Serve the api off of ip:port/api/...
 
 var errorAPI = require('./app/controllers/error/index');
 router.get('/error', errorAPI.getAll);
 router.get('/error/:id', errorAPI.getOne);
 router.post('/error/type/:type/desc/:desc', errorAPI.create);
 router.put('/error/:id/type/:type/desc/:desc', errorAPI.modify);
 router.delete('/error/:id', errorAPI.remove);
 
 var readingAPI = require('./app/controllers/reading/index');
 router.get('/reading/:id', readingAPI.getOne);
 router.get('/reading/run/:run', readingAPI.getByRun);
 router.get('/reading/run/:run/sensor/:sensor', readingAPI.getByRunAndSensor);
 router.get('/reading/after/:after_time/before/:before_time', readingAPI.getByTime);
 router.post('/reading/run/:run/sensor/:sensor/reading/:reading', readingAPI.createWithoutTime);
 router.post('/reading/run/:run/sensor/:sensor/reading/:reading/time/:time', readingAPI.createWithTime);
 router.put('/reading/:id/value/:value', readingAPI.modify);
 router.delete('/reading/:id', readingAPI.remove);
 router.delete('/reading/run/:run', readingAPI.removeByRun);
 router.delete('/reading/sensor/:sensor', readingAPI.removeBySensor);
 
 var runAPI = require('./app/controllers/run/index');
 router.get('/run', runAPI.getAll);
 router.get('/run/:id', runAPI.getOne);
 router.post('/run', runAPI.create);
 router.post('/run/title/:title', runAPI.createWithTitle);
 router.post('/run/title/:title/desc/:desc', runAPI.createWithDetails);
 router.put('/run/:id/title/:title/desc/:desc', runAPI.modify);
 router.delete('/run/:id', runAPI.remove);

 
// Serve index.html for all possible routes
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Start server
app.listen(port, function() {
	console.log('[SERVER] Ground Control waiting for Major Tom on port: ' + port + '!');
});