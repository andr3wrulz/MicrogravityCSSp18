/*
GET		/runerror/x								get_runerror(x)							Get run error where error_number == x
GET		/runerror/run/x							get_runerror_run(x)						Get errors where run_id == x/error/y
GET		/runerror/error/x						get_runerror_error(x)					Get errors where error_id = x
GET		/runerror/after/x						get_runerror_after(x)					Get errors with timestamp >= x
GET		/runerror/before/x						get_runerror_before(x)					Get errors with timestamp <= x
GET		/runerror/after/x/before/y				get_runerror_between(x, y)				Get errors with timestamp between x and y
POST	/runerror/run/x/error/y					create_runerror(x, y)					Create a new runtime error on run x with error_id y
POST	/runerror/run/x/error/y/sensor/z		create_runerror_sensor(x, y, z)			Create a new runtime error on run x with error_id y and sensor_id z
POST	/runerror/run/x/error/y/time/z			create_runerror_time(x, y, z)			Create a new runtime error on run x with error_id y and timestamp z
POST	/runerror/run/x/error/y/sensor/z/time/a	create_runerror_sensor_time(x, y, z, a)	Create a new runtime error on run x with error_id y, sensor_id z and timestamp a
DELETE	/runerror/x								remove_runerror(x)						Delete run error where error_number == x
*/

module.exports = {
	getOne: function(req, res) {
		let error_number = req.params.id;
		
		if (!error_number) {
			return res.status(400).send({error: true, message: 'Please provide a error_number!'});
		}
		
		dbConnection.query("CALL get_runerror(?)", error_number,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested runtime error"});
		});
	},
	getByRun: function(req, res) {
		let run_id = req.params.run;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("CALL get_runerror_run(?)", run_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested runtime error(s)"});
		});
	},
	getByError: function(req, res) {
		let error_id = req.params.error;
		
		if (!error_id) {
			return res.status(400).send({error: true, message: 'Please provide a error_id!'});
		}
		
		dbConnection.query("CALL get_runerror_error(?)", error_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested runtime error(s)"});
		});
	},
	getAfter: function(req, res) {
		let after_time = req.params.after_time;
		
		if (!after_time) {
			return res.status(400).send({error: true, message: 'Please provide a after_time!'});
		}
		
		dbConnection.query("CALL get_runerror_after(?)", after_time,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested runtime error(s)"});
		});
	},
	getBefore: function(req, res) {
		let before_time = req.params.before_time;
		
		if (!before_time) {
			return res.status(400).send({error: true, message: 'Please provide a before_time!'});
		}
		
		dbConnection.query("CALL get_runerror_before(?)", before_time,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested runtime error(s)"});
		});
	},
	getByTime: function(req, res) {
		let before_time = req.params.before_time;
		let after_time = req.params.after_time;
		
		if (!before_time || !after_time) {
			return res.status(400).send({error: true, message: 'Please provide a before_time and after_time!'});
		}
		
		dbConnection.query("CALL get_runerror_between(?, ?)", [after_time, before_time],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested runtime error(s)"});
		});
	},
	create: function(req, res) {
		let run_id = req.params.run;
		let error_id = req.params.error;
		
		if (!run_id || !error_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id and error_id!'});
		}
		
		dbConnection.query("CALL create_runerror(?, ?)", [run_id, error_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Created runtime error"});
		});
	},
	createWithSensor: function(req, res) {
		let run_id = req.params.run;
		let error_id = req.params.error;
		let sensor_id = req.params.sensor;
		
		if (!run_id || !error_id || !sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id, error_id and sensor_id!'});
		}
		
		dbConnection.query("CALL create_runerror_sensor(?, ?, ?)", [run_id, error_id, sensor_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Created runtime error"});
		});
	},
	createWithTime: function(req, res) {
		let run_id = req.params.run;
		let error_id = req.params.error;
		let timestamp = req.params.time;
		
		if (!run_id || !error_id || !timestamp) {
			return res.status(400).send({error: true, message: 'Please provide a run_id, error_id and timestamp!'});
		}
		
		dbConnection.query("CALL create_runerror_time(?, ?, ?)", [run_id, error_id, timestamp],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Created runtime error"});
		});
	},
	createWithAll: function(req, res) {
		let run_id = req.params.run;
		let error_id = req.params.error;
		let sensor_id = req.params.sensor;
		let timestamp = req.params.time;
		
		if (!run_id || !error_id || !sensor_id || !timestamp) {
			return res.status(400).send({error: true, message: 'Please provide a run_id, error_id, sensor_id and timestamp!'});
		}
		
		dbConnection.query("CALL create_runerror_sensor_time(?, ?, ?, ?)", [run_id, error_id, sensor_id, timestamp],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Created runtime error"});
		});
	},
	remove: function(req, res) {
		let error_number = req.params.id;
		
		if (!error_number) {
			return res.status(400).send({error: true, message: 'Please provide a error_number!'});
		}
		
		dbConnection.query("CALL remove_runerror(?)", error_number,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted runtime error"});
		});
	}
};