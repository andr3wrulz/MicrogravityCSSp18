/*
GET		/user								Return list of all users
POST	/user/username/x/password/y/admin/z	Create user with username x, password y and admin_flag z (hashes password)
PUT		/user/username/x/password/y			Update the password of the specified user, x, to the hashed value of y
DELETE	/user/username/x					Remove the user with username x
*/

var bcrypt = require('bcrypt-nodejs');

module.exports = {
	getAll: function(req, res) {
		dbConnection.query("SELECT * FROM users",
		 function(error, results, fields) {
			if (error) {
				console.log("[ERROR] userAPI.getAll SQL error");
				console.log(error);
				return res.status(400).send({error: error, message: 'Could not get users from database!'});
			}
			return res.send({error: error, data: results, message: "All users"});
		});
	},
	create: function(req, res) {	
		let username = req.params.username;
		let password = req.params.password;
		let admin_flag = req.params.admin_flag;

		console.log("[NOTICE] Trying to create user with username: " + username + " password: " + password + " admin: " + admin_flag);

		if (!username || !password || !admin_flag) {
			return res.status(400).send({error: true, message: 'Please provide a username, password and the admin flag!'});
		}

		if (admin_flag != 'Y' && admin_flag != 'N') {
			return res.status(400).send({error: true, message: 'Malformed admin flag! Only Y and N are accepted'});
		}

		bcrypt.hash(password, null, null, function (err, hash) {
			if (err) {
				console.log("[ERROR] userAPI.create bcrypt error");
				console.log(err);
				return res.status(400).send({error: err, data: {}, message: "Could not hash password!"});
			}
			dbConnection.query("INSERT INTO users (username, password, admin_flag) VALUES (?, ?, ?)", [username, hash, admin_flag],
				function (error, results, fields) {
					if (error) {
						console.log("[ERROR] userAPI.create SQL insert failed!");
						console.log(JSON.stringify(error));
						return res.status(400).send({error: error, data: {}, message: "Could not add user to database!"});
					}
					console.log("[NOTICE] Added new user to database!");
					return res.send({error: error, data: results, message: 'Successfully added new user'});
				}
			);
		});
	},
	setPassword: function(req, res) {
		// For now, delete user and re-add to change password until I figure out how we want the UI
	},
	remove: function(req, res) {
		let username = req.params.username;
		
		if (!username) {
			return res.status(400).send({error: true, message: 'Please provide a username!'});
		}
		
		dbConnection.query("DELETE FROM users WHERE username = ?", username,
		function(error, results, fields) {
			if (error) {
				console.log("[ERROR] userAPI.remove SQL delete error");
				console.log(error);
				return res.status(400).send({error: error, message: 'Could not delete user from database!'});
			}
			console.log("[NOTICE] Deleted user " + username + " from the database");
			return res.send({error: error, data: results, message: "Deleted requested run"});
		});
	}
};