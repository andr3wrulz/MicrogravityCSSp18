/*
GET		/run					Get all runs
GET		/run/x					Get run where run_id == x
POST	/run					Create a new run
POST	/run/title/x			Create a new run with title x/
POST	/run/title/x/desc/y		Create a new run with title x and description y
PUT		/run/x/title/y/desc/z	Modify run info where run_id == x and set title = y and description = z
DELETE	/run/x					Delete run where run_id == x, should delete run data too
*/

module.exports = {
	getAll: function(req, res) {
		dbConnection.query("SELECT * FROM runs",
		 function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "All runs"});
		});
	},
	getOne: function(req, res) {
		let run_id = req.params.id;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("SELECT * FROM runs WHERE run_id = ?", run_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Requested run"});
		});
	},
	create: function(req, res) {		
		dbConnection.query("INSERT INTO runs VALUES ()",
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: 'Created run, refer to insertID field of data'});
		});
	},
	createWithTitle: function(req, res) {
		let title = req.params.title;
		
		if (!title) {
			return res.status(400).send({error: true, message: 'Please provide a title!'});
		}
		
		dbConnection.query("INSERT INTO runs (title) VALUES (?)", title,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: 'Created run, refer to insertID field of data'});
		});
	},
	createWithDetails: function(req, res) {
		let title = req.params.title;
		let desc = req.params.desc;
		
		if (!title || !desc) {
			return res.status(400).send({error: true, message: 'Please provide a title and description!'});
		}
		
		dbConnection.query("INSERT INTO runs (title, description) VALUES (?, ?)", [title, desc],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: 'Created run, refer to insertID field of data'});
		});
	},
	modify: function(req, res) {
		let run_id = req.params.id;
		let title = req.params.title;
		let desc = req.params.desc;
		
		if (!title || !desc || !run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id, title and description!'});
		}
		
		dbConnection.query("UPDATE runs SET title = ?, description = ? WHERE run_id = ?", [title, desc, run_id],
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: 'Modified run'});
		});
	},
	remove: function(req, res) {
		let run_id = req.params.id;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("DELETE FROM runs WHERE run_id = ?", run_id,
		function(error, results, fields) {
			if (error) throw error;
			return res.send({error: error, data: results, message: "Deleted requested run"});
		});
	}
};