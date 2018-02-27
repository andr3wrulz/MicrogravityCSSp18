/*
GET		/error						Get all errors
GET		/error/x					Get error where error_id == x
POST	/error/type/x/desc/y		Create a new error with type x and description y
PUT		/error/x/type/y/desc/z		Modify error info where error_id == x and set type = y and description = z
DELETE	/error/x					Delete error where error_id == x
*/

module.exports = {
	getAll: function(req, res) {
		
		dbConnection.query("SELECT * FROM errors ", function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested errors"});
		});
	},
	getOne: function(req, res) {
		let error_id = req.params.id;
		
		if (!error_id) {
			return res.status(400).send({error: true, message: 'Please provide a error_id!'});
		}
		
		dbConnection.query("SELECT * FROM errors WHERE error_id = ?", error_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested error"});
		});
	},
	create: function(req, res) {
		let type = req.params.type;
		let desc = req.params.desc;
		
		if (!type || !desc) {
			return res.status(400).send({error: true, message: 'Please provide a type and description!'});
		}
		
		dbConnection.query("INSERT INTO errors (type, description) VALUES (?, ?)", [type, desc],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: 'Created error, refer to insertID field of data'});
		});
	},
	modify: function(req, res) {
		let error_id = req.params.id;
		let type = req.params.type;
		let desc = req.params.desc;
		
		if (!type || !desc || !error_id) {
			return res.status(400).send({error: true, message: 'Please provide a error_id, type and description!'});
		}
		
		dbConnection.query("UPDATE errors SET type = ?, description = ? WHERE error_id = ?", [type, desc, error_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: 'Modified error'});
		});
	},
	remove: function(req, res) {
		let error_id = req.params.id;
		
		if (!error_id) {
			return res.status(400).send({error: true, message: 'Please provide a error_id!'});
		}
		
		dbConnection.query("DELETE FROM errors WHERE error_id = ?", error_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested error"});
		});
	}
};