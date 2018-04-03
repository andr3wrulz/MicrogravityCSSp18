// Each table has its own file to keep structure organized
// All routes are defined in this file and link to the call in the table's file

module.exports = function(router) {
	var errorAPI = require('./error/index');
	router.get('/error', errorAPI.getAll);
	router.get('/error/:id', errorAPI.getOne);
	router.post('/error/type/:type/desc/:desc', errorAPI.create);
	router.put('/error/:id/type/:type/desc/:desc', errorAPI.modify);
	router.delete('/error/:id', errorAPI.remove);

	var readingAPI = require('./reading/index');
	router.get('/reading/getsensorsinrun/:run', readingAPI.getSensorsInRun);
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

	var runAPI = require('./run/index');
	router.get('/run', runAPI.getAll);
	router.get('/run/latest', runAPI.getLatest);
	router.get('/run/:id', runAPI.getOne);
	router.post('/run', runAPI.create);
	router.post('/run/title/:title', runAPI.createWithTitle);
	router.post('/run/title/:title/desc/:desc', runAPI.createWithDetails);
	router.put('/run/:id/title/:title/desc/:desc', runAPI.modify);
	router.delete('/run/:id', runAPI.remove);
	
	var runErrorAPI = require('./runerror/index');
	router.get('/runerror/:id', runErrorAPI.getOne);
	router.get('/runerror/run/:run', runErrorAPI.getByRun);
	router.get('/runerror/error/:error_id', runErrorAPI.getByError);
	router.get('/runerror/after/:after_time', runErrorAPI.getAfter);
	router.get('/runerror/before/:before_time', runErrorAPI.getBefore);
	router.get('/runerror/after/:after_time/before/:before_time', runErrorAPI.getByTime);
	router.post('/runerror/run/:run/error/:error', runErrorAPI.create);
	router.post('/runerror/run/:run/error/:error/sensor/:sensor', runErrorAPI.createWithSensor);
	router.post('/runerror/run/:run/error/:error/time/:time', runErrorAPI.createWithTime);
	router.post('/runerror/run/:run/error/:error/sensor/:sensor/time/:time', runErrorAPI.createWithAll);
	router.delete('/runerror/:id', runErrorAPI.remove);
	
	var sensorAPI = require('./sensor/index');
	router.get('/sensor', sensorAPI.getAll);
	router.get('/sensor/:id', sensorAPI.getOne);
	router.post('/sensor/type/:type/units/:units', sensorAPI.create);
	router.post('/sensor/type/:type/units/:units/desc/:desc', sensorAPI.createWithDescription);
	router.put('/sensor/:id/type/:type/units/:units/desc/:desc', sensorAPI.modify);
	router.delete('/sensor/:id', sensorAPI.remove);
	
	var sensorTypeAPI = require('./sensortype/index');
	router.get('/sensortype', sensorTypeAPI.getAll);
	router.get('/sensortype/:id', sensorTypeAPI.getOne);
	router.post('/sensortype/desc/:desc', sensorTypeAPI.create);
	router.put('/sensortype/:id/desc/:desc', sensorTypeAPI.modify);
	router.delete('/sensortype/:id', sensorTypeAPI.remove);
};