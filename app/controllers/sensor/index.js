/*
GET		/sensor/x						Get sensor where sensor_id == x
POST	/sensor/type/x/units/y			Create a new sensor of type x with units y
POST	/sensor/type/x/units/y/desc/z	Create a new sensor of type x with units y and description z
PUT		/sensor/x/type/y/units/z/desc/a	Modify sensor info where sensor_id == x and set type = y, units = z and description = a
DELETE	/sensor/x						Delete sensor where sensor_id == x
*/

module.exports = {
	getOne: function(req, res) {
		let sensor_id = req.params.id;
		
		if (!sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_id!'});
		}
		
		dbConnection.query("SELECT * FROM sensors WHERE sensor_id = ?", sensor_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested sensor"});
		});
	},
	create: function(req, res) {
		let sensor_type = req.params.type;
		let units = req.params.units;
		
		if (!sensor_type || !units) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type and units!'});
		}
		
		dbConnection.query("INSERT INTO sensors (sensor_type, units) VALUES (?, ?)", [sensor_type, units],
		function(error, results, fields) {
			if (error) throw error;
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
		
		dbConnection.query("INSERT INTO sensors (sensor_type, units, description) VALUES (?, ?, ?)", [sensor_type, units, description],
		function(error, results, fields) {
			if (error) throw error;
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
		
		dbConnection.query("UPDATE sensors SET sensor_type = ?, units = ?, description = ? WHERE sensor_id = ?", [sensor_type, units, description, sensor_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Updated sensor"});
		});
	},
	remove: function(req, res) {
		let sensor_id = req.params.id;
		
		if (!sensor_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_id!'});
		}
		
		dbConnection.query("DELETE FROM sensors WHERE sensor_id = ?", sensor_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted sensor"});
		});
	}
};