// Each table has its own file to keep structure organized
// All routes are defined in this file and link to the call in the table's file

module.exports = function(router, passport) {
	var errorAPI = require('./error');
	router.get('/error', auth, auth, errorAPI.getAll);
	router.get('/error/:id', auth, errorAPI.getOne);
	router.post('/error/type/:type/desc/:desc', auth, errorAPI.create);
	router.put('/error/:id/type/:type/desc/:desc', auth, errorAPI.modify);
	router.delete('/error/:id', auth, errorAPI.remove);

	var readingAPI = require('./reading');
	router.get('/reading/getsensorsinrun/:run', auth, readingAPI.getSensorsInRun);
	router.get('/reading/:id', auth, readingAPI.getOne);
	router.get('/reading/run/:run', auth, readingAPI.getByRun);
	router.get('/reading/run/:run/sensor/:sensor', auth, readingAPI.getByRunAndSensor);
	router.get('/reading/after/:after_time/before/:before_time', auth, readingAPI.getByTime);
	router.post('/reading/run/:run/sensor/:sensor/reading/:reading', auth, readingAPI.createWithoutTime);
	router.post('/reading/run/:run/sensor/:sensor/reading/:reading/time/:time', auth, readingAPI.createWithTime);
	router.put('/reading/:id/value/:value', auth, readingAPI.modify);
	router.delete('/reading/:id', auth, readingAPI.remove);
	router.delete('/reading/run/:run', auth, readingAPI.removeByRun);
	router.delete('/reading/sensor/:sensor', auth, readingAPI.removeBySensor);

	var runAPI = require('./run');
	router.get('/run', auth, runAPI.getAll);
	router.get('/run/latest', auth, runAPI.getLatest);
	router.get('/run/:id', auth, runAPI.getOne);
	router.post('/run', auth, runAPI.create);
	router.post('/run/title/:title', auth, runAPI.createWithTitle);
	router.post('/run/title/:title/desc/:desc', auth, runAPI.createWithDetails);
	router.put('/run/:id/title/:title/desc/:desc', auth, runAPI.modify);
	router.delete('/run/:id', auth, runAPI.remove);
	
	var runErrorAPI = require('./runerror');
	router.get('/runerror/:id', auth, runErrorAPI.getOne);
	router.get('/runerror/run/:run', auth, runErrorAPI.getByRun);
	router.get('/runerror/error/:error_id', auth, runErrorAPI.getByError);
	router.get('/runerror/after/:after_time', auth, runErrorAPI.getAfter);
	router.get('/runerror/before/:before_time', auth, runErrorAPI.getBefore);
	router.get('/runerror/after/:after_time/before/:before_time', auth, runErrorAPI.getByTime);
	router.post('/runerror/run/:run/error/:error', auth, runErrorAPI.create);
	router.post('/runerror/run/:run/error/:error/sensor/:sensor', auth, runErrorAPI.createWithSensor);
	router.post('/runerror/run/:run/error/:error/time/:time', auth, runErrorAPI.createWithTime);
	router.post('/runerror/run/:run/error/:error/sensor/:sensor/time/:time', auth, runErrorAPI.createWithAll);
	router.delete('/runerror/:id', auth, runErrorAPI.remove);
	
	var sensorAPI = require('./sensor');
	router.get('/sensor', auth, sensorAPI.getAll);
	router.get('/sensor/:id', auth, sensorAPI.getOne);
	router.post('/sensor/type/:type/units/:units', auth, sensorAPI.create);
	router.post('/sensor/type/:type/units/:units/desc/:desc', auth, sensorAPI.createWithDescription);
	router.put('/sensor/:id/type/:type/units/:units/desc/:desc', auth, sensorAPI.modify);
	router.delete('/sensor/:id', auth, sensorAPI.remove);
	
	var sensorTypeAPI = require('./sensortype');
	router.get('/sensortype', auth, sensorTypeAPI.getAll);
	router.get('/sensortype/:id', auth, sensorTypeAPI.getOne);
	router.post('/sensortype/desc/:desc', auth, sensorTypeAPI.create);
	router.put('/sensortype/:id/desc/:desc', auth, sensorTypeAPI.modify);
	router.delete('/sensortype/:id', auth, sensorTypeAPI.remove);

	
};

function auth(req, res, next) {
	console.log("Checking if user is authenticated.");
	console.log(JSON.stringify(req.user));
	// Is the user object part of the request? (only happens after auth)
	if (!req.user || !req.user[0]) {
		// Redirect if not logged in
		res.redirect('/login.html');
	}
	// We authenticated, continue the request
	return next();
}