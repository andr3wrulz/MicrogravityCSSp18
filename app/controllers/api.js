//var errorAPI = require('./error/index');
//var readingAPI = require('./reading/index');
//var runAPI = require('./run/index')(router);
//var runerrorAPI = require('./runerror/index');
//var sensorAPI = require('./sensor/index');
//var sensortypeAPI = require('./sensortype/index');

module.exports = function(router) {
	var errorAPI = require('./error/index');
	router.get('/error', errorAPI.getAll);
	router.get('/error/:id', errorAPI.getOne);
	router.post('/error/type/:type/desc/:desc', errorAPI.create);
	router.put('/error/:id/type/:type/desc/:desc', errorAPI.modify);
	router.delete('/error/:id', errorAPI.remove);

	var readingAPI = require('./reading/index');
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
	router.get('/run/:id', runAPI.getOne);
	router.post('/run', runAPI.create);
	router.post('/run/title/:title', runAPI.createWithTitle);
	router.post('/run/title/:title/desc/:desc', runAPI.createWithDetails);
	router.put('/run/:id/title/:title/desc/:desc', runAPI.modify);
	router.delete('/run/:id', runAPI.remove);
};