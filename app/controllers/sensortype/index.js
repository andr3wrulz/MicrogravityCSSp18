/*
GET		/sensortype/x			Get sensor type where sensor_type_id == x
POST	/sensortype/desc/x		Create new sensor type with description x
PUT		/sensortype/x/desc/y	Modify sensor info where error_id == x and set description = y
DELETE	/sensortype/x			Delete sensor type where sensor_type_id == x
*/

module.exports = {
	getOne: function(req, res) {
		let sensor_type_id = req.params.id;
		
		if (!sensor_type_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type_id!'});
		}
		
		dbConnection.query("SELECT * FROM sensor_type WHERE sensor_type_id = ?", sensor_type_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested sensor type"});
		});
	},
	create: function(req, res) {
		let description = req.params.desc;
		
		if (!description) {
			return res.status(400).send({error: true, message: 'Please provide a description!'});
		}
		
		dbConnection.query("INSERT INTO sensor_type (description) VALUES (?)", description,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Created sensor type"});
		});
	},
	modify: function(req, res) {
		let sensor_type_id = req.params.id;
		let description = req.params.desc;
		
		if (!sensor_type_id || !description) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type_id and description!'});
		}
		
		dbConnection.query("UPDATE sensor_type SET description = ? WHERE sensor_type_id = ?", [description, sensor_type_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Updated sensor type"});
		});
	},
	remove: function(req, res) {
		let sensor_type_id = req.params.id;
		
		if (!sensor_type_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type_id!'});
		}
		
		dbConnection.query("DELETE FROM sensor_type WHERE sensor_type_id = ?", sensor_type_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted sensor type"});
		});
	},
};