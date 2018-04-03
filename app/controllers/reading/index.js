/*
GET		/reading/getchartdata/x						NA								Gets all the readings for run x in a format usable with chartjs
GET		/reading/x									get_reading(x)					Get reading where read_id == x
GET		/reading/run/x								get_reading_run(x)				Get all readings where run_id == x
GET		/reading/run/x/sensor/y						get_reading_sensor(x)			Get readings where run_id == x and sensor_id == y
GET		/reading/after/x/before/y					get_reading_between(x, y)		Get all readings where timestamp between x and y
POST	/reading/run/x/sensor/y/reading/z			create_reading(x, y, z)			Create a reading for run x and sensor y with reading of z
POST	/reading/run/x/sensor/y/reading/z/time/a	create_reading_time(x, y, z, a)	Create a reading for run x and sensor y with reading of z and timestamp of a
PUT		/reading/x/value/y							modify_reading(x, y)			Modify reading where read_id == x and set its reading to y
DELETE	/reading/x									remove_reading(x)				Delete reading where read_id == x
DELETE	/reading/run/x								remove_reading_run(x)			Delete all readings where run_id == x
DELETE	/reading/sensor/x							remove_reading_sensor(x)		Delete all readings where sensor_id == x
*/

module.exports = {
	getChartData: function(req, res) {
		let run_id = req.params.run;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		var data = {};
		/*
		*	data will be formated as an array of objects like
		*	{sensor: sensor_id, description: sensor_description, sensor_type: sensor_type_id, sensor_type_description: sensor_type_description,
		*	units: sensor.units, lables: list of timestamps corresponding to data,
		*	data: sensor readings}
		*/
		
		console.log("Got to getChartData function");
		
		// Get all the sensors in the specified run
		dbConnection.query("CALL get_sensors_in_run(?)", run_id,
		function(error, results, fields) {
			if (error) throw error;
			console.log("Results: " + JSON.stringify(results[0], null, 4));
			
			var data = {};
			
			// Each db call will update its boolean so we can check when we are done
			var done = new Array(results[0].length).fill(false);
			
			// Loop through each sensor in the run and fill out its object
			for (var sensorIndex = 0; sensorIndex < results[0].length; sensorIndex++) {
				var sensor_id = results[0][sensorIndex].sensor_id;
				// Store header data in the sensor's sub-object
				data[sensor_id] = results[0][sensorIndex];
				dbConnection.query("CALL get_reading_sensor_sorted(?, ?)", [run_id, sensor_id],
				function (error2, results2, fields2) {
					if (error) throw error;
					var readings = results2[0].map(item => item.reading);
					var timestamps = results2[0].map(item => item.timestamp);
					data[sensor_id].readings = readings;
					data[sensor_id].timestamps = timestamps;
					if (!done.includes(false)){
						return res.send(data);
					}
				});
			}
			
			//return res.send({error: error, data: results[0], message: "Requested reading(s)"});
		});
	},
	getSensorsInRun: function(req, res) {
		let run_id = req.params.run;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("CALL get_sensors_in_run(?)", run_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send(results[0]);
		});
	},
	getOne: function(req, res) {
		let read_id = req.params.id;
		
		if (!read_id) {
			return res.status(400).send({error: true, message: 'Please provide a read_id!'});
		}
		
		dbConnection.query("CALL get_reading(?)", read_id,
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
		
		dbConnection.query("CALL get_reading_run(?)", run_id,
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
		
		dbConnection.query("CALL get_reading_run_sensor(?, ?)", [run_id, sensor_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send(results);
		});
	},
	getByTime: function(req, res) {
		let before_time = req.params.before_time;
		let after_time = req.params.after_time;
		
		if (!before_time || !after_time) {
			return res.status(400).send({error: true, message: 'Please provide a before_time and after_time!'});
		}
		
		dbConnection.query("CALL get_reading_between(?, ?)", [after_time, before_time],
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
		
		dbConnection.query("CALL create_reading(?, ?, ?)", [run_id, sensor_id, reading],
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
		
		dbConnection.query("CALL create_reading_time(?, ?, ?, ?)", [run_id, sensor_id, reading, time],
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
		
		dbConnection.query("CALL modify_reading(?, ?)", [read_id, new_value],
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
		
		dbConnection.query("CALL remove_reading(?)", read_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested reading"});
		});
	},
	removeByRun: function(req, res) {
		let run_id = req.params.run;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("CALL remove_reading_run(?)", run_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested reading(s)"});
		});
	},
	removeBySensor: function(req, res) {
		let sensor_id = req.params.sensor;
		
		if (!sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_id!'});
		}
		
		dbConnection.query("CALL remove_reading_sensor(?)", sensor_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested reading(s)"});
		});
	},
};