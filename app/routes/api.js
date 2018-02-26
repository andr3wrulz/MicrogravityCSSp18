var Run = require('../models/run');

module.exports = function(router) {
	// http://localhost:8080/run
	router.post('/run', function(req, res) {
		var run = new Run();
		run.runid = req.body.runid;
		run.start = req.body.start;
		run.end = req.body.end;
		if(req.body.runid == null || req.body.runid =='') {
			res.send('Ensure required fields id and start time');
		} else {
			run.save(function(err) {
				if (err) {
					res.send(err);
				} else {
					res.send('Run created!');
				}
			});
		}
	});
	return router;
}