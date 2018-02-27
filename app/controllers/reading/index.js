/*
GET		/reading/x									Get reading where read_id == x
GET		/reading/run/x								Get all readings where run_id == x
GET		/reading/run/x/sensor/y						Get readings where run_id == x and sensor_id == y
GET		/reading/after/x/before/y					Get all readings where timestamp between x and y
POST	/reading/run/x/sensor/y/reading/z			Create a reading for run x and sensor y with reading of z
POST	/reading/run/x/sensor/y/reading/z/time/a	Create a reading for run x and sensor y with reading of z and timestamp of a
PUT		/reading/x/value/y							Modify reading where read_id == x and set its reading to y
DELETE	/reading/x									Delete reading where read_id == x
DELETE	/reading/run/x								Delete all readings where run_id == x
DELETE	/reading/sensor/x							Delete all readings where sensor_id == x
*/

module.exports = {
	getOne: function(req, res) {
		let read_id = req.params.id;
		
		if (!read_id) {
			return res.status(400).send({error: true, message: 'Please provide a read_id!'});
		}
		
		dbConnection.query("SELECT * FROM readings WHERE read_id = ?", read_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested reading"});
		});
	},
	getByRun: function(req, res) {
		let run_id = req.params.run;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("SELECT * FROM readings WHERE run_id = ?", run_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested reading(s)"});
		});
	},
	getByRunAndSensor: function(req, res) {
		let run_id = req.params.run;
		let sensor_id = req.params.sensor;
		
		if (!run_id || !sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id and sensor_id!'});
		}
		
		dbConnection.query("SELECT * FROM readings WHERE run_id = ? and sensor_id = ?", [run_id, sensor_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested reading(s)"});
		});
	},
	getByTime: function(req, res) {
		let before_time = req.params.before_time;
		let after_time = req.params.after_time;
		
		if (!before_time || !after_time) {
			return res.status(400).send({error: true, message: 'Please provide a before_time and after_time!'});
		}
		
		dbConnection.query("SELECT * FROM readings WHERE timestamp BETWEEN ? AND ?", [after_time, before_time],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested reading(s)"});
		});
	},
	createWithoutTime: function(req, res) {
		let run_id = req.params.run;
		let sensor_id = req.params.sensor;
		let reading = req.params.reading;
		
		if (!reading || !run_id || !sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a reading, a run_id, and a sensor_id!'});
		}
		
		dbConnection.query("INSERT INTO readings (run_id, sensor_id, reading) VALUES (?, ?, ?)", [run_id, sensor_id, reading],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Inserted reading, refer to insertID field of data"});
		});
	},
	createWithTime: function(req, res) {
		let run_id = req.params.run;
		let sensor_id = req.params.sensor;
		let reading = req.params.reading;
		let time = req.params.time;
		
		if (!reading || !run_id || !sensor_id || !time) {
			return res.status(400).send({error: true, message: 'Please provide a reading, timestamp, run_id, and sensor_id!'});
		}
		
		dbConnection.query("INSERT INTO readings (run_id, sensor_id, reading, timestamp) VALUES (?, ?, ?, ?)", [run_id, sensor_id, reading, time],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Inserted reading, refer to insertID field of data"});
		});
	},
	modify: function(req, res) {
		let read_id = req.params.id;
		let new_value = req.params.value;
		
		if (!read_id || !new_value) {
			return res.status(400).send({error: true, message: 'Please provide a read_id and a new_value!'});
		}
		
		dbConnection.query("UPDATE readings SET reading = ? WHERE read_id = ?", [new_value, read_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Updated requested reading"});
		});
	},
	remove: function(req, res) {
		let read_id = req.params.id;
		
		if (!read_id) {
			return res.status(400).send({error: true, message: 'Please provide a read_id!'});
		}
		
		dbConnection.query("DELETE FROM readings WHERE read_id = ?", read_id, function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested reading"});
		});
	},
	removeByRun: function(req, res) {
		let run_id = req.params.run;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("DELETE FROM readings WHERE run_id = ?", run_id, function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested reading(s)"});
		});
	},
	removeBySensor: function(req, res) {
		let sensor_id = req.params.sensor;
		
		if (!sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_id!'});
		}
		
		dbConnection.query("DELETE FROM readings WHERE sensor_id = ?", sensor_id, function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested reading(s)"});
		});
	},
};