/*
GET		/sensor							get_all_sensors()				Get all sensors
GET		/sensor/x						get_sensor(x)					Get sensor where sensor_id == x
POST	/sensor/type/x/units/y			create_sensor(x, y)				Create a new sensor of type x with units y
POST	/sensor/type/x/units/y/desc/z	create_sensor_desc(x, y, z)		Create a new sensor of type x with units y and description z
PUT		/sensor/x/type/y/units/z/desc/a	modify_sensor(x, y, z, a)		Modify sensor info where sensor_id == x and set type = y, units = z and description = a
DELETE	/sensor/x						remove_sensor(x)				Delete sensor where sensor_id == x
*/

module.exports = {
	getAll: function(req, res) {
		dbConnection.query("CALL get_all_sensors()",
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Requested sensor"});
		});
	},
	getOne: function(req, res) {
		let sensor_id = req.params.id;
		
		if (!sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_id!'});
		}
		
		dbConnection.query("CALL get_sensor(?)", sensor_id,
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Requested sensor"});
		});
	},
	create: function(req, res) {
		let sensor_type = req.params.type;
		let units = req.params.units;
		
		if (!sensor_type || !units) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type and units!'});
		}
		
		dbConnection.query("CALL create_sensor(?, ?)", [sensor_type, units],
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Created sensor"});
		});
	},
	createWithDescription: function(req, res) {
		let sensor_type = req.params.type;
		let units = req.params.units;
		let description = req.params.desc;
		
		if (!sensor_type || !units || !description) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type, units and description!'});
		}
		
		dbConnection.query("CALL create_sensor_desc(?, ?, ?)", [sensor_type, units, description],
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Created sensor"});
		});
	},
	modify: function(req, res) {
		let sensor_id = req.params.id;
		let sensor_type = req.params.type;
		let units = req.params.units;
		let description = req.params.desc;
		
		if (!sensor_id || !sensor_type || !units || !description) {
			return res.status(400).send({error: true, message: 'Please provide an sensor_id, sensor_type, units and description!'});
		}
		
		dbConnection.query("CALL modify_sensor(?, ?, ?, ?)", [sensor_id, sensor_type, units, description],
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Updated sensor"});
		});
	},
	remove: function(req, res) {
		let sensor_id = req.params.id;
		
		if (!sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_id!'});
		}
		
		dbConnection.query("CALL remove_sensor(?)", sensor_id,
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Deleted sensor"});
		});
	}
};