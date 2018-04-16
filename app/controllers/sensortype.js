/*
GET		/sensortype				get_all_sensortypes()	Get all sensor types
GET		/sensortype/x			get_sensortype(x)		Get sensor type where sensor_type_id == x
POST	/sensortype/desc/x		create_sensortype(x)	Create new sensor type with description x
PUT		/sensortype/x/desc/y	modify_sensortype(x, y)	Modify sensor info where error_id == x and set description = y
DELETE	/sensortype/x			remove_sensortype(x)	Delete sensor type where sensor_type_id == x
*/

module.exports = {
	getAll: function(req, res) {
		dbConnection.query("CALL get_all_sensortypes()",
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Requested sensor types"});
		});
	},
	getOne: function(req, res) {
		let sensor_type_id = req.params.id;
		
		if (!sensor_type_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type_id!'});
		}
		
		dbConnection.query("CALL get_sensortype(?)", sensor_type_id,
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Requested sensor type"});
		});
	},
	create: function(req, res) {
		let description = req.params.desc;
		
		if (!description) {
			return res.status(400).send({error: true, message: 'Please provide a description!'});
		}
		
		dbConnection.query("CALL create_sensortype(?)", description,
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Created sensor type"});
		});
	},
	modify: function(req, res) {
		let sensor_type_id = req.params.id;
		let description = req.params.desc;
		
		if (!sensor_type_id || !description) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type_id and description!'});
		}
		
		dbConnection.query("CALL modify_sensortype(?, ?)", [sensor_type_id, description],
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Updated sensor type"});
		});
	},
	remove: function(req, res) {
		let sensor_type_id = req.params.id;
		
		if (!sensor_type_id) {
			return res.status(400).send({error: true, message: 'Please provide a sensor_type_id!'});
		}
		
		dbConnection.query("CALL remove_sensortype(?)", sensor_type_id,
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Deleted sensor type"});
		});
	},
};