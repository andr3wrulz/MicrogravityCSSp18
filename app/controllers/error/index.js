/*
GET		/error						get_all_errors()		Get all errors
GET		/error/x					get_error(x)			Get error where error_id == x
POST	/error/type/x/desc/y		create_error(x, y)		Create a new error with type x and description y
PUT		/error/x/type/y/desc/z		modify_error(x, y, z)	Modify error info where error_id == x and set type = y and description = z
DELETE	/error/x					remove_error(x)			Delete error where error_id == x
*/

module.exports = {
	getAll: function(req, res) {
		
		dbConnection.query("CALL get_all_errors()",
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested errors"});
		});
	},
	getOne: function(req, res) {
		let error_id = req.params.id;
		
		if (!error_id) {
			return res.status(400).send({error: true, message: 'Please provide a error_id!'});
		}
		
		dbConnection.query("CALL get_error(?)", error_id,
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
		
		dbConnection.query("CALL create_error(?, ?)", [type, desc],
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
		
		dbConnection.query("CALL modify_error(?, ?, ?)", [error_id, type, desc],
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
		
		dbConnection.query("CALL remove_error(?)", error_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested error"});
		});
	}
};