/*
GET		/run					get_all_runs				Get all runs
GET		/run/latest				get_latest_run				Retrieves the highest run number
GET		/run/x					get_run(x)					Get run where run_id == x
POST	/run/startrun			send_start_command			Creates an entry in the commands table with a START command_type if no pending ones exist	
POST	/run					create_run()				Create a new run
POST	/run/title/x			create_run_title(x)			Create a new run with title x
POST	/run/title/x/desc/y		create_run_title_desc(x, y)	Create a new run with title x and description y
PUT		/run/x/title/y/desc/z	modify_run(x, y, z)			Modify run info where run_id == x and set title = y and description = z
DELETE	/run/x					remove_run(x)				Delete run where run_id == x, should delete run data too
*/

module.exports = {
	getAll: function(req, res) {
		dbConnection.query("CALL get_all_runs()",
		 function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "All runs"});
		});
	},
	getLatest: function(req, res) {
		dbConnection.query("SELECT MAX(run_id) AS run_id, (SELECT MIN(r.timestamp) FROM readings AS r WHERE r.run_id = run_id) AS start FROM runs",
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send(results[0]);
		});
	},
	getOne: function(req, res) {
		let run_id = req.params.id;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("CALL get_run(?)", run_id,
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Requested run"});
		});
	},
	startRun: function(req, res) {
		dbConnection.query("CALL send_start_command()",
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send(results);
		});
	},
	create: function(req, res) {		
		dbConnection.query("CALL create_run()",
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: 'Created run, refer to insertID field of data'});
		});
	},
	createWithTitle: function(req, res) {
		let title = req.params.title;
		
		if (!title) {
			return res.status(400).send({error: true, message: 'Please provide a title!'});
		}
		
		dbConnection.query("CALL create_run_title", title,
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: 'Created run, refer to insertID field of data'});
		});
	},
	createWithDetails: function(req, res) {
		let title = req.params.title;
		let desc = req.params.desc;
		
		if (!title || !desc) {
			return res.status(400).send({error: true, message: 'Please provide a title and description!'});
		}
		
		dbConnection.query("CALL create_run_title_desc", [title, desc],
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
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
		
		dbConnection.query("CALL modify_run(?, ?, ?)", [run_id, title, desc],
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: 'Modified run'});
		});
	},
	remove: function(req, res) {
		let run_id = req.params.id;
		
		if (!run_id) {
			return res.status(400).send({error: true, message: 'Please provide a run_id!'});
		}
		
		dbConnection.query("CALL remove_run(?)", run_id,
		function(error, results, fields) {
			if (error) { console.log("[ERROR] Undetermined error"); console.log(error); }
			return res.send({error: error, data: results, message: "Deleted requested run"});
		});
	}
};